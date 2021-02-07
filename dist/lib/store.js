import {Resource, ResourceStatus} from "./resource.js";
import {fetchResource} from "./client.js";
import {urls} from "../helpers/urls.js";
import {datatypeFromUrl} from "./datatypes.js";
export class Store {
  constructor(base_url) {
    this.base_url = base_url;
    this.resources = new Map();
    this.subscribers = new Map();
  }
  addResource(resource) {
    this.resources.set(resource.getSubject(), resource);
    this.notify(resource);
  }
  async fetchResource(subject) {
    if (this.resources.get(subject) == void 0) {
      const fetched = await fetchResource(subject);
      this.addResource(fetched);
      return fetched;
    }
  }
  getResource(subject) {
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
  async getProperty(subject) {
    const resource = await this.getResource(subject);
    if (!resource.isReady()) {
      return null;
    }
    const prop = new Property();
    prop.datatype = datatypeFromUrl(resource.get(urls.properties.datatype)?.toString());
    return prop;
  }
  getBaseUrl() {
    return "Store base url is " + this.base_url;
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
