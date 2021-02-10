import { Resource } from './resource';

/** All the types that a Value might contain */
export type JSVals = string | Date | number | string[] | Date | Resource;

/** A Nested Resource is an Anonymous resource, without a subject URL of its own. However, it does contain values. */
export type NestedResource = Map<string, JSVals>;

/** Atomic Data Value. Can be any datatype: https://atomicdata.dev/classes/Datatype */
export class Value {
  private val: JSVals;

  /** Createes a new Vales, makes (possibly incorrect) assumptions about its Datatype based on the input value */
  constructor(val: JSVals) {
    this.val = val;
  }

  /** Tries to convert the value as an array of resources, which can be both URLs or Nested Resources. Throws an error when fails */
  toArray(): string[] {
    if (this.val.constructor == Array) {
      return this.val;
    }
    throw new Error(`Not an array: ${this.val}`);
  }

  /** Tries to convert the value (timestamp or date) to a JS Date. Throws an error when fails. */
  toDate(): Date {
    // If it's a unix epoch timestamp...
    if (typeof this.val == 'number') {
      const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCMilliseconds(this.val);
      return date;
    }
    if (typeof this.val == 'string') {
      return new Date(this.val.toString());
    }
    throw new Error(`Cannot be converted into Date: ${this.val}`);
  }

  /** Returns a default string representation of the value. */
  toString(): string {
    return this.val.toString();
  }

  /** Returns either the URL of the resource, or the NestedResource itself. */
  toResource(): string | NestedResource {
    if (typeof this.val == 'string') {
      return this.val;
    }
    return this.val;
  }

  /** Returns the internal JSON based value */
  value(): JSVals {
    return this.val;
  }
}
