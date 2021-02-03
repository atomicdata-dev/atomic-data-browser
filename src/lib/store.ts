import { fetchResource } from './client';

/** All the types that a Value might contain */
type JSVals = string | Date | number;

/** Atomic Data Value. Can be any https://atomicdata.dev/classes/Datatype */
export class Value {
  val: JSVals;

  constructor(val: JSVals) {
    this.val = val;
  }

  toString(): string {
    return this.val.toString();
  }
}

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
    const resource = new Resource('mySubject');
    resource.set('myProp', new Value('myVal'));
    this.addResource(resource);
  }

  /** Adds a Resource to the store. */
  addResource(resource: Resource): void {
    this.resources.set(resource.subject, resource);
    this.notify(resource);
  }

  /** Gets a resource by URL. Fetches and parses it if it's not available in the store. */
  async getResource(subject: string): Promise<Resource> {
    const found = this.resources.get(subject);
    if (found == undefined) {
      return fetchResource(subject);
    }
    return found;
  }

  /** Returns the URL of the companion server */
  getBaseUrl(): string {
    return 'Store base url is ' + this.base_url;
  }

  /** Let's subscribers know that a resource has been changed. Time to update your views! */
  notify(resource: Resource): void {
    const subject = resource.subject;
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

/** Describes an Atomic Resource, which has a Subject URL and a bunch of Property / Value combinations. */
export class Resource {
  subject: string;
  propvals: Map<string, Value>;

  constructor(subject: string) {
    this.subject = subject;
    this.propvals = new Map();
  }

  /** Get a Value by its property */
  get(propUrl: string): Value {
    return this.propvals.get(propUrl);
  }

  /** Set a Property, Value combination */
  set(prop: string, val: Value): void {
    this.propvals.set(prop, val);
  }
}
