import {checkValidURL} from "./client.js";
export var ResourceStatus;
(function(ResourceStatus2) {
  ResourceStatus2[ResourceStatus2["loading"] = 0] = "loading";
  ResourceStatus2[ResourceStatus2["error"] = 1] = "error";
  ResourceStatus2[ResourceStatus2["ready"] = 2] = "ready";
})(ResourceStatus || (ResourceStatus = {}));
export class Resource {
  constructor(subject) {
    this.subject = subject;
    this.propvals = new Map();
  }
  isReady() {
    return this.status == 2;
  }
  get(propUrl) {
    const result = this.propvals.get(propUrl);
    if (result == void 0) {
      return null;
    }
    return result;
  }
  getError() {
    return this.error;
  }
  getStatus() {
    return this.status;
  }
  getSubject() {
    return this.subject;
  }
  getPropVals() {
    return this.propvals;
  }
  set(prop, val) {
    this.propvals.set(prop, val);
  }
  setStatus(status) {
    this.status = status;
  }
  setError(e) {
    this.setStatus(1);
    this.error = e;
  }
  setSubject(subject) {
    checkValidURL(subject);
    this.subject = subject;
  }
}
