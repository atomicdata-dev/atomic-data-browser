import {handleError} from "../helpers/handlers.js";
import {properties} from "../helpers/urls.js";
import {checkValidURL, postCommit} from "./client.js";
import {CommitBuilder} from "./commit.js";
import {validate} from "./datatypes.js";
export var ResourceStatus;
(function(ResourceStatus2) {
  ResourceStatus2[ResourceStatus2["loading"] = 0] = "loading";
  ResourceStatus2[ResourceStatus2["error"] = 1] = "error";
  ResourceStatus2[ResourceStatus2["ready"] = 2] = "ready";
})(ResourceStatus || (ResourceStatus = {}));
export class Resource {
  constructor(subject) {
    if (subject == void 0) {
      subject = `local:resource/` + Math.random().toString(32);
    }
    this.subject = subject;
    this.propvals = new Map();
    this.commitBuilder = new CommitBuilder(subject);
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
  getClasses() {
    const classesVal = this.get(properties.isA);
    if (classesVal == void 0) {
      return [];
    }
    try {
      const arr = classesVal.toArray();
      return arr;
    } catch (e) {
      return [];
    }
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
  async destroy(store) {
    const newCommitBuilder = new CommitBuilder(this.getSubject());
    newCommitBuilder.destroy = true;
    const agent = store.getAgent();
    const commit = await newCommitBuilder.sign(agent.privateKey, agent.subject);
    await postCommit(commit, store.getBaseUrl() + `/commit`);
    store.removeResource(this.getSubject());
  }
  async save(store) {
    const agent = store.getAgent();
    const commit = await this.commitBuilder.sign(agent.privateKey, agent.subject);
    await postCommit(commit, store.getBaseUrl() + `/commit`);
    store.addResource(this);
    return this.getSubject();
  }
  async setValidate(prop, value, store) {
    const fullProp = await store.getProperty(prop);
    const newVal = validate(value, fullProp.datatype);
    this.propvals.set(prop, newVal);
    this.commitBuilder.set[prop] = newVal.toNative(fullProp.datatype);
    return newVal;
  }
  setUnsafe(prop, val) {
    this.propvals.set(prop, val);
  }
  setStatus(status) {
    this.status = status;
  }
  setError(e) {
    this.setStatus(1);
    handleError(e);
    this.error = e;
  }
  setSubject(subject) {
    checkValidURL(subject);
    this.subject = subject;
  }
}
