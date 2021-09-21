import { Resource, ResourceStatus, unknownSubject } from './resource';
import { tryValidURL, fetchResource } from './client';
import { urls } from './urls';
import { Datatype, datatypeFromUrl } from './datatypes';
import { Agent } from './agent';
import { startWebsocket } from './websockets';

type callback = (resource: Resource) => void;

/**
 * An in memory store that has a bunch of usefful methods for retrieving Atomic
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
  /** Current Connection to a WebSocket. Initilaizes on setting baseURL */
  // TODO: should this be an array? A user might be viewing data from various servers
  webSocket: WebSocket;
  /**
   * Is called when the store encounters an error. By default simply throws the
   * error, but can be overwritten
   */
  public errorHandler: (e: Error) => unknown;

  constructor() {
    this.resources = new Map();
    this.subscribers = new Map();
    this.errorHandler = (e: Error) => {
      throw e;
    };
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
  getResourceLoading(subject?: string, newResource?: boolean): Resource | null {
    // This is needed because it can happen that the useResource react hook is called while there is no subject passed.
    if (subject == undefined) {
      const newR = new Resource(unknownSubject, newResource);
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
    // This leads to multiple fetches!
    const resource = await this.getResourceAsync(subject);
    if (resource == undefined) {
      throw Error(`Property ${subject} is not found`);
    }
    if (resource.isReady() == false) {
      throw Error(`Property ${subject} cannot be loaded`);
    }
    const prop = new Property();
    const datatypeUrl = resource.get(urls.properties.datatype);
    if (datatypeUrl == null) {
      throw Error(
        `Property ${subject} has no datatype: ${resource.getPropVals()}`,
      );
    }
    const shortname = resource.get(urls.properties.shortname);
    if (shortname == null) {
      throw Error(
        `Property ${subject} has no shortname: ${resource.getPropVals()}`,
      );
    }
    const description = resource.get(urls.properties.description);
    if (description == null) {
      throw Error(
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
  handleError(e: Error | string): void {
    if (typeof e == 'string') {
      e = new Error(e);
    }
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

  /** Removes (destroys / deletes) resource from this store */
  removeResource(subject: string): void {
    this.resources.delete(subject);
  }

  /**
   * Changes the Subject of a Resource. Checks if the new name is already taken,
   * errors if so.
   */
  async renameSubject(oldSubject: string, newSubject: string): Promise<void> {
    tryValidURL(newSubject);
    const old = this.resources.get(oldSubject);
    if (old == undefined) {
      throw Error(`Old subject does not exist in store: ${oldSubject}`);
    }
    if (await this.checkSubjectTaken(newSubject)) {
      throw Error(`New subject name is already taken: ${newSubject}`);
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
      throw Error('baseUrl should not have a trailing slash');
    }
    this.baseUrl = baseUrl;
    // TODO This is not the right place
    this.setWebSocket();
  }

  // TODO: don't do this, have one websocket per domain
  /** Closes an old websocket and opens a new one to the BaseURL */
  setWebSocket() {
    this.webSocket && this.webSocket.close();
    this.webSocket = startWebsocket(this);
  }

  /**
   * Registers a callback for when the a resource is updated. When you call
   * this, you should probably also call .unsubscribe some time later.
   */
  // TODO: consider subscribing to properties, maybe add a second subscribe function, use that in useValue
  subscribe(subject: string, callback: callback): void {
    if (subject == undefined) {
      throw Error('Cannot subscribe to undefined subject');
      return;
    }
    let callbackArray = this.subscribers.get(subject);
    if (callbackArray == undefined) {
      // Only subscribe once
      this.subscribeWebSocket(subject);
      callbackArray = [];
    }
    callbackArray.push(callback);
    this.subscribers.set(subject, callbackArray);
  }

  subscribeWebSocket(subject: string) {
    if (subject == unknownSubject) {
      return;
    }
    // TODO: check if there is a websocket for this base URL or not
    try {
      // Only subscribe if there's a websocket. When it's opened, all subject will be iterated and subscribed
      if (this.webSocket?.readyState == WebSocket.OPEN) {
        this.webSocket?.send(`SUBSCRIBE ${subject}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  unSubscribeWebSocket(subject: string) {
    if (subject == unknownSubject) {
      return;
    }
    try {
      this.webSocket?.send(`UNSUBSCRIBE ${subject}`);
    } catch (e) {
      console.log(e);
    }
  }

  /** Unregisters the callback (see `subscribe()`) */
  unsubscribe(subject: string, callback: callback): void {
    if (subject == undefined) {
      console.warn('Cannot unsubscribe from undefined subject');
      return;
    }
    let callbackArray = this.subscribers.get(subject);
    // Remove the function from the callBackArray
    callbackArray = callbackArray.filter(item => item !== callback);
    this.subscribers.set(subject, callbackArray);
  }
}

export class Property {
  subject: string;
  datatype: Datatype;
  shortname: string;
  description: string;
  /** https://atomicdata.dev/properties/classType */
  classType?: string;
  /** If the Property cannot be found or parsed, this will contain the error */
  error?: Error;
  /** https://atomicdata.dev/properties/isDynamic */
  isDynamic?: boolean;
}
