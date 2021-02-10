import { handleError } from '../helpers/handlers';
import { checkValidURL } from './client';
import { validate } from './datatypes';
import { Store } from './store';
import { JSVals, Value } from './value';

/** Contains the PropertyURL / Value combinations */
type PropVals = Map<string, Value>;

export enum ResourceStatus {
  loading,
  error,
  ready,
}

/** Describes an Atomic Resource, which has a Subject URL and a bunch of Property / Value combinations. */
export class Resource {
  private subject: string;
  private propvals: PropVals;
  /** If the resource could not be fetched, we put that info here. */
  private error?: Error;
  private status: ResourceStatus;

  constructor(subject: string) {
    this.subject = subject;
    this.propvals = new Map();
  }

  /** Checks if the resource is both loaded and free from errors */
  isReady(): boolean {
    return this.status == ResourceStatus.ready;
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

  /** Commits the changes and sends it to the default server. Returns the new Url if succesful, throws an error if things go wrong */
  async save(store: Store): Promise<string> {
    // TODO: implement
    store.addResource(this);
    return this.getSubject();
  }

  /** Set a Property, Value combination and perform a validation. */
  async setValidate(prop: string, value: JSVals, store: Store): Promise<Value> {
    const fullProp = await store.getProperty(prop);
    const newVal = validate(value, fullProp.datatype);
    this.propvals.set(prop, newVal);
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

  /** Set a Property, Value combination */
  setSubject(subject: string): void {
    checkValidURL(subject);
    this.subject = subject;
  }
}
