import { Resource, ResourceStatus } from './resource';
import { tryValidURL, fetchResource } from './client';
import { urls } from './urls';
import { Datatype, datatypeFromUrl } from './datatypes';
import { Agent } from './agent';

type callback = (resource: Resource) => void;

/**
 * An in memory store that has a bunch of useful methods for retrieving Atomic
 * Data Resources. It is also resposible for keeping the Resources in sync with
 * Subscribers (components that use the Resource), and for managing the current
 * Agent (User).
 */
export class Store {
  /** The default store URL, where to send commits and where to create new instances */
  baseUrl: string;
  /** All the resources of the store */
  resources: Map<string, Resource>;
  /** A list of all functions that need to be called when a certain resource is updated */
  subscribers: Map<string, Array<callback>>;
  /** Current Agent, used for signing commits. Is required for posting things. */
  agent?: Agent;
  /** Is called when the store encounters an error. */
  errorHandler?: (e: Error) => unknown;

  constructor() {
    this.resources = new Map();
    this.subscribers = new Map();
  }

  /** Adds a Resource to the store. Replaces existing. Notifies subscribers */
  addResource(resource: Resource): void {
    this.resources.set(resource.getSubject(), resource);
    this.notify(resource);
  }

  /** Checks if a subject is free to use */
  async checkSubjectTaken(subject: string): Promise<boolean> {
    const r = await this.getResourceAsync(subject);
    if (r.isReady()) {
      return true;
    }
    // TODO: IMPLEMENT
    return false;
  }

  /** Creates a random URL. Add a classnme (e.g. 'persons') to make a nicer name */
  createSubject(className?: string): string {
    const random = Math.random().toString(36).substring(2);
    className = className ? className : 'things';
    return `${this.getBaseUrl()}/${className}/${random}`;
  }

  /**
   * Fetches a resource by URL. Does not do anything by default if the resource
   * is already present, even if it has errored
   */
  async fetchResource(
    /** The resource URL to be fetched */
    subject: string,
    /** Always fetch the resource, even if there is one in the store */
    forceRefresh?: boolean,
    /**
     * Fetch it from the `/path` endpoint of your baseURL. This effectively is a
     * proxy / cache.
     */
    fromProxy?: boolean,
  ): Promise<Resource> {
    if (forceRefresh || this.resources.get(subject) == undefined) {
      const fetched = await fetchResource(
        subject,
        fromProxy && this.getBaseUrl(),
      );
      this.addResource(fetched);
      return fetched;
    }
  }

  getAllSubjects(): string[] {
    return Array.from(this.resources.keys());
  }

  /** Returns the URL of the companion server */
  getBaseUrl(): string | null {
    if (this.baseUrl == undefined) {
      return null;
    }
    return this.baseUrl;
  }

  /**
   * Returns the Currently set Agent, returns null if there is none. Make sure
   * to first run `store.setAgent()`.
   */
  getAgent(): Agent | null {
    if (this.agent == undefined) {
      return null;
    }
    return this.agent;
  }

  /**
   * Gets a resource by URL. Fetches and parses it if it's not available in the
   * store. Instantly returns an empty loading resource, while the fetching is
   * done in the background . If the subject is undefined, an empty non-saved
   * resource will be returned.
   */
  getResourceLoading(subject: string, newResource?: boolean): Resource | null {
    if (subject == undefined) {
      const newR = new Resource(undefined, newResource);
      newR.setStatus(ResourceStatus.new);
      return newR;
    }
    const found = this.resources.get(subject);
    if (found == undefined) {
      const newR = new Resource(subject, newResource);
      this.addResource(newR);
      if (newResource) {
        return newR;
      }
      this.fetchResource(subject, true);
      return newR;
    }
    return found;
  }

  /**
   * Gets a resource by URL. Fetches and parses it if it's not available in the
   * store. Not recommended to use this for rendering, because it might cause
   * resources to be fetched multiple times.
   */
  async getResourceAsync(subject: string): Promise<Resource> {
    const found = this.resources.get(subject);
    if (found == undefined) {
      const newR = await this.fetchResource(subject);
      return newR;
    }
    return found;
  }

  /** Gets a property by URL. */
  async getProperty(subject: string): Promise<Property> {
    const resource = await this.getResourceAsync(subject);
    if (resource == undefined) {
      throw new Error(`Property ${subject} is not found`);
    }
    const prop = new Property();
    const datatypeUrl = resource.get(urls.properties.datatype);
    if (datatypeUrl == null) {
      throw new Error(
        `Property ${subject} has no datatype: ${resource.getPropVals()}`,
      );
    }
    const shortname = resource.get(urls.properties.shortname);
    if (shortname == null) {
      throw new Error(
        `Property ${subject} has no shortname: ${resource.getPropVals()}`,
      );
    }
    const description = resource.get(urls.properties.description);
    if (description == null) {
      throw new Error(
        `Property ${subject} has no shortname: ${resource.getPropVals()}`,
      );
    }
    const classTypeURL = resource.get(urls.properties.classType)?.toString();
    prop.classType = classTypeURL;
    prop.shortname = shortname.toString();
    prop.description = description.toString();
    prop.datatype = datatypeFromUrl(datatypeUrl.toString());
    return prop;
  }

  /**
   * This is called when Errors occur in some of the library functions. Set your
   * errorhandler function to `store.errorHandler`.
   */
  handleError(e: Error): void {
    this.errorHandler(e) || console.error(e);
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

  /** Removes resource from this store */
  removeResource(subject: string): void {
    this.resources.delete(subject);
  }

  /**
   * Changes the Subject of a Resource. Checks if the new name is already taken,
   * throws an error if so.
   */
  async renameSubject(oldSubject: string, newSubject: string): Promise<void> {
    tryValidURL(newSubject);
    const old = this.resources.get(oldSubject);
    if (old == undefined) {
      throw new Error(`Old subject does not exist in store: ${oldSubject}`);
    }
    if (await this.checkSubjectTaken(newSubject)) {
      throw new Error(`New subject name is already taken: ${newSubject}`);
    }
    old.setSubject(newSubject);
    this.resources.set(newSubject, old);
    this.removeResource(oldSubject);
  }

  /**
   * Sets the current Agent, used for signing commits. Warning: doing this
   * stores the Private Key of the Agent in memory. This might have security
   * implications for your application.
   */
  setAgent(agent: Agent): void {
    this.agent = agent;
  }

  /** Sets the Base URL, without the trailing slash. */
  setBaseUrl(baseUrl: string): void {
    tryValidURL(baseUrl);
    if (baseUrl.substr(-1) == '/') {
      throw new Error('baseUrl should not have a trailing slash');
    }
    this.baseUrl = baseUrl;
  }

  /**
   * Registers a callback for when the a resource is updated. When you call
   * this, you should probably also call .unsubscribe some time later.
   */
  // TODO: consider subscribing to properties, maybe add a second subscribe function, use that in useValue
  subscribe(subject: string, callback: callback): void {
    let callbackArray = this.subscribers.get(subject);
    if (callbackArray == undefined) {
      callbackArray = [];
    }
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

export class Property {
  subject: string;
  datatype: Datatype;
  shortname: string;
  description: string;
  classType?: string;
  /** If the Property cannot be found or parsed, this will contain the error */
  error?: Error;
}
