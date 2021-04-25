import { Resource, ResourceStatus } from './resource';
import { checkValidURL, fetchResource } from './client';
import { urls } from '../helpers/urls';
import { Datatype, datatypeFromUrl } from './datatypes';
import { Agent } from './agent';

type callback = (resource: Resource) => void;

/** An in memory store that has a bunch of useful methods for retrieving and */
export class Store {
  /** The default store URL, where to send commits and where to create new instances */
  baseUrl: string;
  /** All the resources of the store */
  resources: Map<string, Resource>;
  /** A list of all functions that need to be called when a certain resource is updated */
  subscribers: Map<string, Array<callback>>;
  /** Current Agent, used for signing commits. Is required for posting things. */
  agent?: Agent;

  constructor() {
    this.resources = new Map();
    this.subscribers = new Map();
  }

  /** Adds a Resource to the store. Replaces existing. Notifies subscribers */
  addResource(resource: Resource): void {
    this.resources.set(resource.getSubject(), resource);
    this.notify(resource);
  }

  /** Creates a random URL */
  createSubject(): string {
    const random = Math.random().toString(36).substring(2);
    return `${this.getBaseUrl()}/things/${random}`;
  }

  /** Fetches a resource by URL. Does not do anything if the resource is already present, even if it has errored */
  async fetchResource(
    /** The resource URL to be fetched */
    subject: string,
    /** Always fetch the resource, even if there is one in the store */
    forceRefresh?: boolean,
    /** Fetch it from the `/path` endpoint of your baseURL. This effectively is a proxy / cache. */
    fromProxy?: boolean,
  ): Promise<Resource> {
    if (forceRefresh || this.resources.get(subject) == undefined) {
      const fetched = await fetchResource(subject, fromProxy && this.getBaseUrl());
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

  /** Returns the Currently set Agent, throws an error if there is none. Make sure to first run `store.setAgent()`. */
  getAgent(): Agent {
    if (this.agent == undefined) {
      return null;
    }
    return this.agent;
  }

  /**
   * Gets a resource by URL. Fetches and parses it if it's not available in the store. Instantly returns an empty loading resource, while
   * the fetching is done in the background . If the subject is undefined, an empty non-saved resource will be returned.
   */
  getResourceLoading(subject: string): Resource {
    if (subject == undefined) {
      const newR = new Resource(undefined);
      newR.setStatus(ResourceStatus.ready);
      return newR;
    }
    const found = this.resources.get(subject);
    if (found == undefined) {
      this.fetchResource(subject);
      const newR = new Resource(subject);
      newR.setStatus(ResourceStatus.loading);
      this.resources.set(subject, newR);
      return newR;
    }
    return found;
  }

  /**
   * Gets a resource by URL. Fetches and parses it if it's not available in the store. Not recommended to use this for rendering, because it
   * might cause resources to be fetched multiple times.
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
      throw new Error(`Property ${subject} has no datatype: ${resource.getPropVals()}`);
    }
    const shortname = resource.get(urls.properties.shortname);
    if (shortname == null) {
      throw new Error(`Property ${subject} has no shortname: ${resource.getPropVals()}`);
    }
    const description = resource.get(urls.properties.description);
    if (description == null) {
      throw new Error(`Property ${subject} has no shortname: ${resource.getPropVals()}`);
    }
    const classTypeURL = resource.get(urls.properties.classType)?.toString();
    prop.classType = classTypeURL;
    prop.shortname = shortname.toString();
    prop.description = description.toString();
    prop.datatype = datatypeFromUrl(datatypeUrl.toString());
    return prop;
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

  /** Changes the Subject of a Resource */
  renameSubject(oldSubject: string, newSubject: string): void {
    const found = this.resources.get(oldSubject);
    if (found == undefined) {
      throw new Error(`Subject does not exist in store: ${oldSubject}`);
    }
    found.setSubject(newSubject);
    this.resources.set(newSubject, found);
    this.removeResource(oldSubject);
  }

  /** Sets the current Agent, used for signing commits */
  setAgent(agent: Agent): void {
    this.agent = agent;
  }

  /** Sets the Base URL, without the trailing slash. */
  setBaseUrl(baseUrl: string): void {
    checkValidURL(baseUrl);
    if (baseUrl.substr(-1) == '/') {
      throw new Error('baseUrl should not have a trailing slash');
    }
    this.baseUrl = baseUrl;
  }

  /** Registers a callback for when the a resource is updated. */
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
}
