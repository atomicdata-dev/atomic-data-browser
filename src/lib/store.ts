import { Resource } from './resource';
import { fetchResource } from './client';
import { Value } from './value';

type callback = (resource: Resource) => void;

/** An in memory store that has a bunch of useful methods for retrieving and */
export class Store {
  /** The default store URL, where to send commits and where to create new instances */
  base_url: string;
  /** All the resources of the store */
  resources: Map<string, Resource>;
  /** A list of all functions that need to be called when a certain resource is updated */
  subscribers: Map<string, Array<callback>>;

  constructor(base_url: string) {
    this.base_url = base_url;
    this.resources = new Map();
    this.subscribers = new Map();
  }

  /** Adds a bunch of predetermined Resources to the store */
  populate(): void {
    const resource = new Resource('https://atomicdata.dev/test');
    resource.set('https://atomicdata.dev/properties/shortname', new Value('value-from-populate'));
    this.addResource(resource);
  }

  /** Adds a Resource to the store. Replaces existing. */
  addResource(resource: Resource): void {
    this.resources.set(resource.getSubject(), resource);
    this.notify(resource);
  }

  /** Gets a resource by URL. Fetches and parses it if it's not available in the store. */
  async getResource(subject: string): Promise<Resource> {
    const found = this.resources.get(subject);
    if (found == undefined) {
      return await this.fetchResource(subject);
    }
    return found;
  }

  /** Returns the URL of the companion server */
  getBaseUrl(): string {
    return 'Store base url is ' + this.base_url;
  }

  /** Fetches a resource by URL, replaces the one in the store. */
  async fetchResource(subject: string): Promise<Resource> {
    const fetched = await fetchResource(subject);
    this.addResource(fetched);
    return fetched;
  }

  /** Let's subscribers know that a resource has been changed. Time to update your views! */
  notify(resource: Resource): void {
    const subject = resource.getSubject();
    const subscribers = this.subscribers.get(subject);
    if (subscribers == undefined) {
      return;
    }
    subscribers.map(callback => {
      callback(resource);
    });
  }

  /** Registers a callback for when the subject resource is updated. */
  subscribe(subject: string, callback: callback): void {
    // const callbackArray = this.subscribers.get(subject);
    const callbackArray = [];
    callbackArray.push(callback);
    this.subscribers.set(subject, callbackArray);
  }

  /** Unregisters the callback (see `subscribe()`) */
  unsubscribe(subject: string, callback: callback): void {
    let callbackArray = this.subscribers.get(subject);
    callbackArray = callbackArray.filter(item => item !== callback);
    this.subscribers.set(subject, callbackArray);
  }
}
