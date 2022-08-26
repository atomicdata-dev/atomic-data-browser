import {
  Agent,
  Datatype,
  datatypeFromUrl,
  fetchResource,
  Resource,
  tryValidURL,
  unknownSubject,
  urls,
} from './index';
import { startWebsocket } from './websockets';

type callback = (resource: Resource) => void;

/**
 * An in memory store that has a bunch of usefful methods for retrieving Atomic
 * Data Resources. It is also resposible for keeping the Resources in sync with
 * Subscribers (components that use the Resource), and for managing the current
 * Agent (User).
 */
export class Store {
  /**
   * The base URL of an Atomic Server. This is where to send commits, create new
   * instances, search, etc.
   */
  serverUrl: string;
  /** All the resources of the store */
  resources: Map<string, Resource>;
  /** A list of all functions that need to be called when a certain resource is updated */
  subscribers: Map<string, Array<callback>>;
  /** Current Agent, used for signing commits. Is required for posting things. */
  agent?: Agent;
  /** Current Connection to a WebSocket. Initilaizes on setting baseURL */
  // TODO: should this be a `Map` of websockets? A user might be viewing data from various servers
  webSocket: WebSocket;
  /**
   * Is called when the store encounters an error. By default simply throws the
   * error, but can be overwritten
   */
  public errorHandler: (e: Error) => unknown;

  constructor(
    opts: {
      /** The default store URL, where to send commits and where to create new instances */
      serverUrl?: string;
      /** Default Agent, used for signing commits. Is required for posting things. */
      agent?: Agent;
    } = {},
  ) {
    opts.serverUrl && this.setServerUrl(opts.serverUrl);
    opts.serverUrl && this.setAgent(opts.agent);
    this.resources = new Map();
    this.subscribers = new Map();
    this.errorHandler = (e: Error) => {
      throw e;
    };
  }

  private randomPart(): string {
    return Math.random().toString(36).substring(2);
  }

  private async findAvailableSubject(
    path: string,
    firstTry = true,
  ): Promise<string> {
    let url = `${this.getServerUrl()}/${path}`;

    if (!firstTry) {
      const randomPart = this.randomPart();
      url += `-${randomPart}`;
    }

    const taken = await this.checkSubjectTaken(url);

    if (taken) {
      return this.findAvailableSubject(path, false);
    }

    return url;
  }
  /**
   * Adds a Resource to the store and notifies subscribers. Replaces existing
   * resources, unless this new resource is explicitly incomplete.
   */
  addResource(resource: Resource): void {
    // Incomplete resources may miss some properties
    if (resource.get(urls.properties.incomplete)) {
      // If there is a resource with the same subject, we won't overwrite it with an incomplete one
      const existing = this.resources.get(resource.getSubject());
      if (existing && !existing.loading) {
        return;
      }
    }

    this.resources.set(resource.getSubject(), resource);
    // We clone
    this.notify(resource.clone());
  }

  /** Checks if a subject is free to use */
  async checkSubjectTaken(subject: string): Promise<boolean> {
    const r = await this.getResourceAsync(subject);
    if (r.isReady()) {
      return true;
    }
    return false;
  }

  /**
   * Checks is a set of URL parts can be combined into an available subject.
   * Will retry until it works.
   */
  async buildUniqueSubjectFromParts(...parts: string[]): Promise<string> {
    const path = parts.join('/');
    return this.findAvailableSubject(path);
  }

  /** Creates a random URL. Add a classnme (e.g. 'persons') to make a nicer name */
  createSubject(className?: string): string {
    const random = this.randomPart();
    className = className ? className : 'things';
    return `${this.getServerUrl()}/${className}/${random}`;
  }

  /** Fetches a resource by URL and adds it to the store. */
  async fetchResource(
    /** The resource URL to be fetched */
    subject: string,
    opts: {
      /**
       * Fetch it from the `/path` endpoint of your server URL. This effectively
       * is a proxy / cache.
       */
      fromProxy?: boolean;
      /** Overwrites the existing resource and sets it to loading. */
      setLoading?: boolean;
    } = {},
  ): Promise<Resource> {
    if (opts.setLoading) {
      const newR = new Resource(subject);
      newR.loading = true;
      this.addResource(newR);
    }
    const fetched = await fetchResource(
      subject,
      this,
      opts.fromProxy && this.getServerUrl(),
    );
    return fetched;
  }

  getAllSubjects(): string[] {
    return Array.from(this.resources.keys());
  }

  /** Returns the base URL of the companion server */
  getServerUrl(): string | null {
    if (this.serverUrl == undefined) {
      return null;
    }
    return this.serverUrl;
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
  getResourceLoading(
    subject?: string,
    opts: {
      /** Won't fetch the resource if it's new */
      newResource?: boolean;
      /**
       * If this is true, incomplete resources will not be automatically
       * fetched. This limits the amount of requests. Use this for things like
       * menu items.
       */
      allowIncomplete?: boolean;
    } = {},
  ): Resource | null {
    // This is needed because it can happen that the useResource react hook is called while there is no subject passed.
    if (subject == undefined) {
      const newR = new Resource(unknownSubject, opts.newResource);
      return newR;
    }
    const found = this.resources.get(subject);
    if (found == undefined) {
      const newR = new Resource(subject, opts.newResource);
      newR.loading = true;
      this.addResource(newR);
      if (!opts.newResource) {
        this.fetchResource(subject);
      }
      return newR;
    } else if (!opts.allowIncomplete && found.loading == false) {
      // In many cases, a user will always need a complete resource.
      // This checks if the resource is incomplete and fetches it if it is.
      if (found.get(urls.properties.incomplete)) {
        found.loading = true;
        this.addResource(found);
        this.fetchResource(subject);
      }
      return found;
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
    if (resource.error) {
      throw Error(`Property ${subject} cannot be loaded: ${resource.error}`);
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
        `Property ${subject} has no description: ${resource.getPropVals()}`,
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
    // eslint-disable-next-line no-console
    this.errorHandler(e) || console.error(e);
  }

  /**
   * If the store does not have an active internet connection, will return
   * false. This may affect some functionality. For example, some checks will
   * not be performed client side when offline.
   */
  isOffline(): boolean {
    return !window?.navigator?.onLine;
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
    // TODO: maybe iterate over all loaded resources, check if they have an Unauthorized error, and retry these.
    agent &&
      this.resources.forEach(r => {
        if (r.isUnauthorized()) {
          this.fetchResource(r.getSubject());
        }
      });
  }

  /** Sets the Server base URL, without the trailing slash. */
  setServerUrl(url: string | null): void {
    if (url == null) {
      this.serverUrl = null;
      return;
    }
    tryValidURL(url);
    if (url.substr(-1) == '/') {
      throw Error('baseUrl should not have a trailing slash');
    }
    this.serverUrl = url;
    // TODO This is not the right place
    this.setWebSocket();
  }

  // TODO: don't do this, have one websocket per domain
  /** Closes an old websocket and opens a new one to the BaseURL */
  setWebSocket(): void {
    this.webSocket && this.webSocket.close();
    // Check if we're running in a webbrowser
    if (typeof window !== 'undefined') {
      this.webSocket = startWebsocket(this);
    } else {
      // eslint-disable-next-line no-console
      console.warn('WebSockets not supported, no window available');
    }
  }

  /**
   * Registers a callback for when the a resource is updated. When you call
   * this, you should probably also call .unsubscribe some time later.
   */
  // TODO: consider subscribing to properties, maybe add a second subscribe function, use that in useValue
  subscribe(subject: string, callback: callback): void {
    if (subject == undefined) {
      throw Error('Cannot subscribe to undefined subject');
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

  subscribeWebSocket(subject: string): void {
    if (subject == unknownSubject) {
      return;
    }
    // Don't subscribe to resources that the server can't handle
    if (!subject.startsWith(this.serverUrl)) {
      return;
    }
    // TODO: check if there is a websocket for this server URL or not
    try {
      // Only subscribe if there's a websocket. When it's opened, all subject will be iterated and subscribed
      if (this.webSocket?.readyState == 1) {
        this.webSocket?.send(`SUBSCRIBE ${subject}`);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  unSubscribeWebSocket(subject: string): void {
    if (subject == unknownSubject) {
      return;
    }
    try {
      this.webSocket?.send(`UNSUBSCRIBE ${subject}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  /** Unregisters the callback (see `subscribe()`) */
  unsubscribe(subject: string, callback: callback): void {
    if (subject == undefined) {
      return;
    }
    let callbackArray = this.subscribers.get(subject);
    // Remove the function from the callBackArray
    callbackArray = callbackArray?.filter(item => item !== callback);
    this.subscribers.set(subject, callbackArray);
  }
}

/**
 * A Property represents a relationship between a Subject and its Value.
 * https://atomicdata.dev/classes/Property
 */
export class Property {
  subject: string;
  /** https://atomicdata.dev/properties/datatype */
  datatype: Datatype;
  /** https://atomicdata.dev/properties/shortname */
  shortname: string;
  /** https://atomicdata.dev/properties/description */
  description: string;
  /** https://atomicdata.dev/properties/classType */
  classType?: string;
  /** If the Property cannot be found or parsed, this will contain the error */
  error?: Error;
  /** https://atomicdata.dev/properties/isDynamic */
  isDynamic?: boolean;
  /** When the Property is still awaiting a server response */
  loading?: boolean;
}
