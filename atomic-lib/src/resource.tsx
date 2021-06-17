import { handleError, handleWarning } from '../atomic-data-browser/helpers/handlers';
import { properties } from '../atomic-data-browser/helpers/urls';
import { tryValidURL, postCommit } from './client';
import { CommitBuilder } from './commit';
import { validate } from './datatypes';
import { Store } from './store';
import { JSVals, Value } from './value';

/** Contains the PropertyURL / Value combinations */
type PropVals = Map<string, Value>;

/** The various basic states that an in-memory Resource can be in. */
export enum ResourceStatus {
  /** Fetching has started, but no response was received */
  loading,
  /** If something went wrong while fetching or parsing */
  error,
  /** Fetched, parsed, stored and ready for usage */
  ready,
  /** Newly created, not saved to the store */
  new,
}

/** Describes an Atomic Resource, which has a Subject URL and a bunch of Property / Value combinations. */
export class Resource {
  private subject: string;
  private propvals: PropVals;
  /** If the resource could not be fetched, we put that info here. */
  private error?: Error;
  private status: ResourceStatus;
  private commitBuilder: CommitBuilder;

  constructor(subject: string) {
    if (subject == undefined) {
      subject = `local:resource/` + Math.random().toString(32);
      this.status = ResourceStatus.new;
    }

    this.subject = subject;
    this.propvals = new Map();
    this.commitBuilder = new CommitBuilder(subject);
  }

  /** Checks if the resource is both loaded and free from errors */
  isReady(): boolean {
    return this.status == ResourceStatus.ready;
  }

  /** Checks if the resource newly created, and thus not yet saved */
  isNew(): boolean {
    return this.status == ResourceStatus.new;
  }

  /** Get a Value by its property */
  get(propUrl: string): Value | null {
    const result = this.propvals.get(propUrl);
    if (result == undefined) {
      // throw new Error(`not found property ${propUrl} in ${this.subject}`);
      return null;
    }
    return result;
  }

  /** Get a Value by its property */
  getClasses(): string[] {
    const classesVal = this.get(properties.isA);
    if (classesVal == undefined) {
      // throw new Error(`not found property ${propUrl} in ${this.subject}`);
      return [];
    }
    try {
      const arr = classesVal.toArray();
      return arr;
    } catch (e) {
      return [];
    }
  }

  /** Returns the Error of the Resource */
  getError(): Error {
    return this.error;
  }

  /** Returns the status of the Resource (loading, error, ready) */
  getStatus(): ResourceStatus {
    return this.status;
  }

  /** Returns the subject URL of the Resource */
  getSubject(): string {
    return this.subject;
  }

  /** Returns the internal Map of Property-Values */
  getPropVals(): PropVals {
    return this.propvals;
  }

  /** Removes the resource form both the server and locally */
  async destroy(store: Store): Promise<void> {
    const newCommitBuilder = new CommitBuilder(this.getSubject());
    newCommitBuilder.destroy = true;
    const agent = store.getAgent();
    const commit = await newCommitBuilder.sign(agent.privateKey, agent.subject);
    const endpoint = new URL(this.getSubject()).origin + `/commit`;
    await postCommit(commit, endpoint);
    store.removeResource(this.getSubject());
  }

  /** Removes a property value combination from the resource */
  removePropVal(propertyUrl: string): void {
    // Delete from this resource
    this.propvals.delete(propertyUrl);
    // Delete possible item from the commitbuilder set object
    try {
      delete this.commitBuilder.set[propertyUrl];
    } catch (e) {
      handleWarning('Item not present in commitbuilder.set');
    }
    // Add it to the array of items that the server might need to remove after posting.
    this.commitBuilder.remove.push(propertyUrl);
  }

  /**
   * Commits the changes and sends the Commit to the resource's `/commit` endpoint. Returns the new Url if succesful, throws an error if
   * things go wrong
   */
  async save(store: Store): Promise<string> {
    const agent = store.getAgent();
    if (!agent) {
      throw new Error('No agent has been set, you cannot save.');
    }
    // TODO: Check if all required props are there
    const commit = await this.commitBuilder.sign(agent.privateKey, agent.subject);
    const endpoint = new URL(this.getSubject()).origin + `/commit`;
    await postCommit(commit, endpoint);
    // When all succeeds, save it
    store.addResource(this);
    return this.getSubject();
  }

  /**
   * Set a Property, Value combination and perform a validation. Will throw if property is not valid for the datatype. Will fetch the
   * datatype if it's not available.
   */
  async set(prop: string, value: JSVals, store: Store): Promise<Value> {
    const fullProp = await store.getProperty(prop);
    const newVal = validate(value, fullProp.datatype);
    this.propvals.set(prop, newVal);
    // Add the change to the Commit Builder, so we can commit our changes later
    this.commitBuilder.set[prop] = newVal.toNative(fullProp.datatype);
    // If the property has been removed before, undo that
    this.commitBuilder.remove = this.commitBuilder.remove.filter(item => item == prop);
    return newVal;
  }

  /** Set a Property, Value combination without performing validations. */
  setUnsafe(prop: string, val: Value): void {
    this.propvals.set(prop, val);
  }

  /** Should be called during loading / parsing a Resource */
  setStatus(status: ResourceStatus): void {
    this.status = status;
  }

  setError(e: Error): void {
    this.setStatus(ResourceStatus.error);
    handleError(e);
    this.error = e;
  }

  /** Set the Subject / ID URL of the Resource. Does not update the Store. */
  setSubject(subject: string): void {
    tryValidURL(subject);
    this.commitBuilder.subject = subject;
    this.subject = subject;
  }
}
