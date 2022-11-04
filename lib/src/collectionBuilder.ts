import { Collection, CollectionParams } from './collection';
import { Store } from './store';

export class CollectionBuilder {
  private store: Store;
  private server: string;

  private params: CollectionParams = {
    page_size: '30',
  };
  public constructor(store: Store, server: string) {
    this.store = store;
    this.server = server;
  }

  public setProperty(property: string): CollectionBuilder {
    this.params.property = property;

    return this;
  }

  public setValue(value: string): CollectionBuilder {
    this.params.value = value;

    return this;
  }

  public setSortBy(sortBy: string): CollectionBuilder {
    this.params.sort_by = sortBy;

    return this;
  }

  public setPageSize(pageSize: number): CollectionBuilder {
    this.params.page_size = `${pageSize}`;

    return this;
  }

  public build(): Collection {
    return new Collection(this.store, this.server, this.params);
  }
}
