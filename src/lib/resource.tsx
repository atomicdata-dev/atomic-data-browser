import { checkValidURL } from './client';
import { Value } from './value';

/** Contains the PropertyURL / Value combinations */
type PropVals = Map<string, Value>;

/** Describes an Atomic Resource, which has a Subject URL and a bunch of Property / Value combinations. */
export class Resource {
  private subject: string;
  private propvals: PropVals;

  constructor(subject: string) {
    this.subject = subject;
    this.propvals = new Map();
  }

  /** Get a Value by its property */
  get(propUrl: string): Value {
    const result = this.propvals.get(propUrl);
    if (result == undefined) {
      throw new Error(`not found property ${propUrl} in ${this.subject}`);
    }
    return result;
  }

  /** Returns the subject URL of the Resource */
  getSubject(): string {
    return this.subject;
  }

  getPropVals(): PropVals {
    return this.propvals;
  }

  /** Set a Property, Value combination */
  set(prop: string, val: Value): void {
    this.propvals.set(prop, val);
  }

  /** Set a Property, Value combination */
  setSubject(subject: string): void {
    checkValidURL(subject);
    this.subject = subject;
  }
}
