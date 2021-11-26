import { properties } from './urls';
import { tryValidURL, postCommit } from './client';
import { CommitBuilder } from './commit';
import { validate as validateDatatype } from './datatypes';
import { Store } from './store';
import { valToArray } from './value';
import { Agent } from './agent';
import { JSONValue } from '.';
import { isUnauthorized } from './error';

/** Contains the PropertyURL / Value combinations */
export type PropVals = Map<string, JSONValue>;

/**
 * If a resource has no subject, it will have this subject. This means that the
 * Resource is not saved or fetched.
 */
export const unknownSubject = 'unknown-subject';

/**
 * Describes an Atomic Resource, which has a Subject URL and a bunch of Property
 * / Value combinations.
 */
export class Resource {
  private subject: string;
  private propvals: PropVals;
  /** If the resource could not be fetched, we put that info here. */
  error?: Error;
  /** If the commit could not be saved, we put that info here. */
  public commitError?: Error;
  /** Is true for locally created, unsaved resources */
  new: boolean;
  /**
   * Is true when the Resource is currently being fetched, awaiting a response
   * from the Server
   */
  loading: boolean;
  private commitBuilder: CommitBuilder;
  /**
   * Every commit that has been applied should be stored here, which prevents
   * applying the same commit twice
   */
  appliedCommitSignatures: Set<string>;

  constructor(subject: string, newResource?: boolean) {
    if (subject == undefined) {
      throw new Error('no subject given to resource');
    }
    this.new = newResource ? true : false;
    this.loading = false;
    this.subject = subject;
    this.propvals = new Map();
    this.appliedCommitSignatures = new Set();
    this.commitBuilder = new CommitBuilder(subject);
  }

  /** Checks if the agent has write rights by traversing the graph. Recursive function. */
  async canWrite(
    store: Store,
    agent: string,
    child?: string,
  ): Promise<[boolean, string | null]> {
    const writeArray = this.get(properties.write);
    if (writeArray && valToArray(writeArray).includes(agent)) {
      return [true, null];
    }
    const parentSubject = this.get(properties.parent) as string;
    if (parentSubject == undefined) {
      return [false, `No write right or parent in ${this.getSubject()}`];
    }
    // This should not happen, but it prevents an infinite loop
    if (child == parentSubject) {
      console.warn('Circular parent', child);
      return [true, `Circular parent in ${this.getSubject()}`];
    }
    const parent: Resource = await store.getResourceAsync(parentSubject);
    // The recursive part
    return await parent.canWrite(store, agent, this.getSubject());
  }

  /**
   * Creates a clone of the Resource, which makes sure the reference is
   * different from the previous one. This can be useful when doing reference compares.
   */
  clone(): Resource {
    const res = new Resource(this.subject);
    res.propvals = this.propvals;
    res.destroy = this.destroy;
    res.new = this.new;
    res.error = this.error;
    res.commitError = this.commitError;
    res.commitBuilder = this.commitBuilder.clone();
    res.appliedCommitSignatures = this.appliedCommitSignatures;
    return res;
  }

  /** Checks if the resource is both loaded and free from errors */
  isReady(): boolean {
    return !this.loading && this.error == undefined;
  }

  /** Get a Value by its property */
  get(propUrl: string): JSONValue | null {
    const result = this.propvals.get(propUrl);
    if (result == undefined) {
      // throw new Error(`not found property ${propUrl} in ${this.subject}`);
      return null;
    }
    return result;
  }

  /**
   * Get a Value by its property, returns as Array or throws error. Returns
   * empty array if there is no value
   */
  getArray(propUrl: string): string[] | null {
    const result = this.propvals.get(propUrl);
    if (result == undefined) {
      return [];
    }
    return valToArray(result);
  }

  /** Get a Value by its property */
  getClasses(): string[] {
    const classesVal = this.get(properties.isA);
    if (classesVal == undefined) {
      // throw new Error(`not found property ${propUrl} in ${this.subject}`);
      return [];
    }
    try {
      const arr = valToArray(classesVal);
      return arr;
    } catch (e) {
      return [];
    }
  }

  /**
   * Returns the current Commit Builder, which describes the pending changes of
   * the resource
   */
  getCommitBuilder(): CommitBuilder {
    return this.commitBuilder;
  }

  /** Returns the Error of the Resource */
  getError(): Error {
    return this.error;
  }

  /** Returns the subject URL of the Resource */
  getSubject(): string {
    return this.subject;
  }

  /** Returns the subject URL of the Resource */
  getSubjectNoParams(): string {
    const url = new URL(this.subject);
    return url.origin + url.pathname;
  }

  /** Returns the internal Map of Property-Values */
  getPropVals(): PropVals {
    return this.propvals;
  }

  /**
   * Iterates over the parents of the resource, returns who has read / write
   * rights for this resource
   */
  async getRights(store: Store): Promise<Right[]> {
    const rights: Right[] = [];
    const write: string[] = this.getArray(properties.write);
    write.forEach((subject: string) => {
      rights.push({
        for: subject,
        type: RightType.WRITE,
        setIn: this.subject,
      });
    });

    const read: string[] = this.getArray(properties.read);
    read.forEach((subject: string) => {
      rights.push({
        for: subject,
        type: RightType.READ,
        setIn: this.subject,
      });
    });
    const parentSubject = this.get(properties.parent) as string;
    if (parentSubject != undefined) {
      if (parentSubject == this.getSubject()) {
        console.warn('Circular parent', parentSubject);
        return rights;
      }
      const parent = await store.getResourceAsync(parentSubject);
      const parentRights = await parent.getRights(store);
      rights.push(...parentRights);
    }
    console.log('rights', rights);
    return rights;
  }

  /** Returns true is the resource had an `Unauthorized` 401 response. */
  isUnauthorized(): boolean {
    return this.error != undefined && isUnauthorized(this.error);
  }

  /** Removes the resource form both the server and locally */
  async destroy(store: Store, agent?: Agent): Promise<void> {
    const newCommitBuilder = new CommitBuilder(this.getSubject());
    newCommitBuilder.destroy = true;
    if (agent == undefined) {
      agent = store.getAgent();
    }
    if (agent == undefined) {
      throw new Error('No agent has been set or passed, you cannot save this.');
    }
    const commit = await newCommitBuilder.sign(agent.privateKey, agent.subject);
    const endpoint = new URL(this.getSubject()).origin + `/commit`;
    await postCommit(commit, endpoint);
    store.removeResource(this.getSubject());
  }

  /** Removes a property value combination from the resource and adds it to the next Commit */
  removePropVal(propertyUrl: string): void {
    // Delete from this resource
    this.propvals.delete(propertyUrl);
    // Delete possible item from the commitbuilder set object
    try {
      delete this.commitBuilder.set[propertyUrl];
    } catch (e) {
      console.log('Item not present in commitbuilder.set');
    }
    // Add it to the array of items that the server might need to remove after posting.
    this.commitBuilder.remove.push(propertyUrl);
  }

  /**
   * Removes a property value combination from this resource, does not store the
   * remove action in Commit
   */
  removePropValLocally(propertyUrl: string): void {
    this.propvals.delete(propertyUrl);
  }

  /**
   * Commits the changes and sends the Commit to the resource's `/commit`
   * endpoint. Returns the new Url if succesful, throws an error if things go
   * wrong. If you don't pass an Agent explicitly, the default Agent of the
   * Store is used.
   */
  async save(store: Store, agent?: Agent): Promise<string> {
    if (!agent) {
      agent = store.getAgent();
    }
    if (!agent) {
      throw new Error('No agent has been set or passed, you cannot save.');
    }
    // Cloning the CommitBuilder to prevent race conditions, and keeping a back-up of current state for when things go wrong during posting.
    const oldCommitBuilder = this.commitBuilder.clone();
    this.commitBuilder = new CommitBuilder(this.getSubject());
    const commit = await oldCommitBuilder.sign(agent.privateKey, agent.subject);
    // Add the signature to the list of applied ones, to prevent applying it again when the server
    this.appliedCommitSignatures.add(commit.signature);
    this.loading = false;
    // Instantly (optimistically) save for local usage
    // Doing this early is essential for having a snappy UX in the document editor
    store.addResource(this);
    // TODO: Check if all required props are there
    const endpoint = new URL(this.getSubject()).origin + `/commit`;
    try {
      this.commitError = null;
      await postCommit(commit, endpoint);
      return this.getSubject();
    } catch (e) {
      // If it fails, revert to the old resource with the old CommitBuilder
      this.commitBuilder = oldCommitBuilder;
      this.commitError = e;
      store.addResource(this);
      throw e;
    }
  }

  /**
   * Set a Property, Value combination and perform a validation. Will throw if
   * property is not valid for the datatype. Will fetch the datatype if it's not
   * available. Adds the property to the commitbuilder.
   */
  async set(
    prop: string,
    value: JSONValue,
    store: Store,
    /**
     * Disable validation if you don't need it. It might cause a fetch if the
     * Property is not present when set is called
     */
    validate = true,
  ): Promise<void> {
    if (validate) {
      const fullProp = await store.getProperty(prop);
      validateDatatype(value, fullProp.datatype);
    }
    this.propvals.set(prop, value);
    // Add the change to the Commit Builder, so we can commit our changes later
    this.commitBuilder.set[prop] = value;
    // If the property has been removed before, undo that
    this.commitBuilder.remove = this.commitBuilder.remove.filter(
      item => item == prop,
    );
  }

  /**
   * Set a Property, Value combination without performing validations or adding
   * it to the CommitBuilder.
   */
  setUnsafe(prop: string, val: JSONValue): void {
    this.propvals.set(prop, val);
  }

  /** Sets the error on the Resource. Does not Throw. */
  setError(e: Error): void {
    this.error = e;
  }

  /** Set the Subject / ID URL of the Resource. Does not update the Store. */
  setSubject(subject: string): void {
    tryValidURL(subject);
    this.commitBuilder.subject = subject;
    this.subject = subject;
  }
}

enum RightType {
  READ = 'read',
  WRITE = 'write',
}

export interface Right {
  /** Subject of the Agent who the right is for */
  for: string;
  /** The resource that has set the Right */
  setIn: string;
  /** Type of right (e.g. read / write) */
  type: RightType;
}
