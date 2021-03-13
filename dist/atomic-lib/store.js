import {Resource, ResourceStatus} from "./resource.js";
import {checkValidURL, fetchResource} from "./client.js";
import {urls} from "../helpers/urls.js";
import {datatypeFromUrl} from "./datatypes.js";
export class Store {
  constructor() {
    this.resources = new Map();
    this.subscribers = new Map();
  }
  addResource(resource) {
    this.resources.set(resource.getSubject(), resource);
    this.notify(resource);
  }
  createSubject() {
    const random = Math.random().toString(36).substring(2);
    return `${this.getBaseUrl()}/things/${random}`;
  }
  async fetchResource(subject, forceRefresh, fromProxy) {
    if (forceRefresh || this.resources.get(subject) == void 0) {
      const fetched = await fetchResource(subject, fromProxy && this.getBaseUrl());
      this.addResource(fetched);
      return fetched;
    }
  }
  getAllSubjects() {
    return Array.from(this.resources.keys());
  }
  getBaseUrl() {
    if (this.baseUrl == void 0) {
      return null;
    }
    return this.baseUrl;
  }
  getAgent() {
    if (this.agent == void 0) {
      return null;
    }
    return this.agent;
  }
  getResourceLoading(subject) {
    if (subject == void 0) {
      const newR = new Resource(void 0);
      newR.setStatus(ResourceStatus.ready);
      return newR;
    }
    const found = this.resources.get(subject);
    if (found == void 0) {
      this.fetchResource(subject);
      const newR = new Resource(subject);
      newR.setStatus(ResourceStatus.loading);
      this.resources.set(subject, newR);
      return newR;
    }
    return found;
  }
  async getResourceAsync(subject) {
    const found = this.resources.get(subject);
    if (found == void 0) {
      const newR = await this.fetchResource(subject);
      return newR;
    }
    return found;
  }
  async getProperty(subject) {
    const resource = await this.getResourceAsync(subject);
    if (resource == void 0) {
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
  notify(resource) {
    const subject = resource.getSubject();
    const subscribers = this.subscribers.get(subject);
    if (subscribers == void 0) {
      return;
    }
    subscribers.map((callback) => {
      callback(resource);
    });
  }
  removeResource(subject) {
    this.resources.delete(subject);
  }
  setAgent(agent) {
    this.agent = agent;
  }
  setBaseUrl(baseUrl) {
    checkValidURL(baseUrl);
    if (baseUrl.substr(-1) == "/") {
      throw new Error("baseUrl should not have a trailing slash");
    }
    this.baseUrl = baseUrl;
  }
  subscribe(subject, callback) {
    let callbackArray = this.subscribers.get(subject);
    if (callbackArray == void 0) {
      callbackArray = [];
    }
    callbackArray.push(callback);
    this.subscribers.set(subject, callbackArray);
  }
  unsubscribe(subject, callback) {
    let callbackArray = this.subscribers.get(subject);
    callbackArray = callbackArray.filter((item) => item !== callback);
    this.subscribers.set(subject, callbackArray);
  }
}
export class Property {
}
