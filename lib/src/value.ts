import { Datatype } from './datatypes';
import { parseJsonADResource } from './parse';
import { Resource } from './resource';

export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>;

/** All the types that a Value might contain */
export type JSVals = string | number | string[] | Date | Resource | boolean;

/** Atomic Data Value. Can be any datatype: https://atomicdata.dev/classes/Datatype */
export class Value {
  private val: JSVals;

  /**
   * Createes a new Vales, makes (possibly incorrect) assumptions about its
   * Datatype based on the input value
   */
  constructor(val: JSONValue, path?: string) {
    if (val === null || val === undefined) {
      throw Error(
        `New Value cannot be null or undefined, is a ${typeof this.val}`,
      );
    }
    if (val instanceof Array) {
      // Check if all members of array are strings
      if (val.every(v => typeof v == 'string')) {
        this.val = val as string[];
        return;
      } else {
        throw new Error(`New Value cannot be an array of mixed types: ${val}`);
      }
    }
    if (typeof val === 'object') {
      const resourceResource = new Resource(path);
      parseJsonADResource(val, resourceResource);
      this.val = resourceResource;
      return;
    }
    this.val = val as JSVals;
  }

  /**
   * Tries to convert the value as an array of resources, which can be both URLs
   * or Nested Resources. Throws an error when fails
   */
  toArray(): string[] {
    if (this.val.constructor == Array) {
      return this.val;
    }
    throw new Error(`Not an array: ${this.val}, is a ${typeof this.val}`);
  }

  /** Tries to make a boolean from this value. Throws if it is not a boolean. */
  toBoolean(): boolean {
    if (typeof this.val !== 'boolean') {
      throw new Error(`Not a boolean: ${this.val}, is a ${typeof this.val}`);
    }
    return this.val;
  }

  /**
   * Tries to convert the value (timestamp or date) to a JS Date. Throws an
   * error when fails.
   */
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
    throw new Error(
      `Cannot be converted into Date: ${this.val}, is a ${typeof this.val}`,
    );
  }

  /** Converts value to its native JS(ON) counterpart */
  toNative(datatype: Datatype): JSVals {
    switch (datatype) {
      case Datatype.MARKDOWN:
      case Datatype.STRING:
      case Datatype.ATOMIC_URL:
      case Datatype.SLUG:
      case Datatype.DATE:
        return this.toString();
      case Datatype.BOOLEAN:
        return this.toBoolean();
      case Datatype.TIMESTAMP:
        return this.val;
      case Datatype.RESOURCEARRAY:
        return this.toArray();
      default: {
        return this.val;
      }
    }
  }

  /** Returns a number of the value, or throws an error */
  toNumber(): number {
    if (typeof this.val !== 'number') {
      throw new Error(`Not a number: ${this.val}, is a ${typeof this.val}`);
    }
    return this.val;
  }

  /** Returns a default string representation of the value. */
  toString(): string {
    // this.val && this.val.toString();
    return this.val.toString();
  }

  /** Returns either the URL of the resource, or the NestedResource itself. */
  toResource(): string | Resource {
    if (typeof this.val == 'string') {
      return this.val;
    }
    if (this.val instanceof Date) {
      throw new Error(`Not a resource: ${this.val}, is a Date`);
    }
    if (typeof this.val == 'object') {
      //@ts-ignore
      return this.val;
    }
    if (typeof this.val !== 'object') {
      throw new Error(`Not a resource: ${this.val}, is a ${typeof this.val}`);
    }
    throw new Error(`Not a resource: ${this.val}, is a ${typeof this.val}`);
  }

  /** Returns the internal JSON based value */
  value(): JSVals {
    return this.val;
  }
}
