import { isNumber } from './datatypes.js';
import { Resource } from './resource.js';
import { Store } from './store.js';
import { urls } from './urls.js';

export interface QueryFilter {
  property?: string;
  value?: string;
  sort_by?: string;
}

export interface CollectionParams extends QueryFilter {
  page_size: string;
}

/**
 * A collection is a dynamic resource that queries the server for a list of resources that meet it's criteria.
 * Checkout [the docs](https://docs.atomicdata.dev/schema/collections.html) for more information.
 *
 * Keep in mind that the collection does currently not subscribe to changes in the store and will therefore not update if items are added or removed.
 * Use the `invalidate` method to force a refresh.
 */
export class Collection {
  private store: Store;
  private pages = new Map<number, Resource>();
  private server: string;
  private params: CollectionParams;

  private _totalMembers = 0;

  private _waitForReady: Promise<void>;

  public constructor(store: Store, server: string, params: CollectionParams) {
    this.store = store;
    this.server = server;
    this.params = params;

    this._waitForReady = this.fetchPage(0);
    this.invalidate = this.invalidate.bind(this);
  }

  public get property(): string | undefined {
    return this.params.property;
  }

  public get value(): string | undefined {
    return this.params.value;
  }

  public get sortBy(): string | undefined {
    return this.params.sort_by;
  }

  public get pageSize(): number {
    return parseInt(this.params.page_size, 10);
  }

  public get totalMembers(): number {
    return this._totalMembers;
  }

  public waitForReady(): Promise<void> {
    return this._waitForReady;
  }

  public async getMemberWithIndex(index: number): Promise<string> {
    if (index >= this.totalMembers) {
      throw new Error('Index out of bounds');
    }

    const page = Math.floor(index / this.pageSize);

    if (!this.pages.has(page)) {
      this._waitForReady = this.fetchPage(page);
      await this._waitForReady;
    }

    const resource = this.pages.get(page)!;
    const members = resource.getArray(
      urls.properties.collection.members,
    ) as string[];

    return members[index % this.pageSize];
  }

  public invalidate(): Promise<void> {
    return new Promise(resolve => {
      if (!this.pages.has(0)) {
        return resolve();
      }

      const page1Subject = this.pages.get(0)!.getSubject();

      const callback = () => {
        this.store.unsubscribe(page1Subject, callback);

        resolve();
      };

      // Wait for the store to have updated it's cached resource before resolving.
      this.store.subscribe(page1Subject, callback);

      this.pages.forEach(page => {
        this.store.fetchResourceFromServer(page.getSubject());
      });

      this.pages.clear();
    });
  }

  private buildSubject(page: number): string {
    const url = new URL(`${this.server}/collections`);

    for (const [key, value] of Object.entries(this.params)) {
      url.searchParams.set(key, value);
    }

    url.searchParams.set('current_page', `${page}`);

    return url.toString();
  }

  private async fetchPage(page: number): Promise<void> {
    const subject = this.buildSubject(page);
    const resource = await this.store.getResourceAsync(subject);

    if (!resource) {
      throw new Error('Invalid collection: resource does not exist');
    }

    if (resource.error) {
      throw new Error(
        `Invalid collection: resource has error: ${resource.error}`,
      );
    }

    this.pages.set(page, resource);

    const totalMembers = resource.get(urls.properties.collection.totalMembers);

    if (!isNumber(totalMembers)) {
      throw new Error('Invalid collection: total-members is not a number');
    }

    this._totalMembers = totalMembers;
  }
}
