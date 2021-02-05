import { Resource } from './resource';

/** All the types that a Value might contain */
type JSVals = string | Date | number | string[] | Date | Resource;

/** Atomic Data Value. Can be any datatype: https://atomicdata.dev/classes/Datatype */
export class Value {
  private val: JSVals;

  /** Createes a new Vales, makes (possibly incorrect) assumptions about its Datatype based on the input value */
  constructor(val: JSVals) {
    this.val = val;
  }

  toArray(): string[] {
    if (this.val.constructor == Array) {
      return this.val;
    }
    throw new Error(`Not an array: ${this.val}`);
  }

  toDate(): Date {
    return new Date(this.val.toString());
  }

  toString(): string {
    return this.val.toString();
  }
}
