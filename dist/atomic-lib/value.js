import {Datatype} from "./datatypes.js";
export class Value {
  constructor(val) {
    if (val === null || val === void 0) {
      throw Error("New Value cannot be null or undefined");
    }
    this.val = val;
  }
  toArray() {
    if (this.val.constructor == Array) {
      return this.val;
    }
    throw new Error(`Not an array: ${this.val}`);
  }
  toBoolean() {
    if (typeof this.val !== "boolean") {
      throw new Error(`Not a boolean: ${this.val}`);
    }
    return this.val;
  }
  toDate() {
    if (typeof this.val == "number") {
      const date = new Date(0);
      date.setUTCMilliseconds(this.val);
      return date;
    }
    if (typeof this.val == "string") {
      return new Date(this.val.toString());
    }
    throw new Error(`Cannot be converted into Date: ${this.val}`);
  }
  toNative(datatype) {
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
        return this.toString();
      }
    }
  }
  toNumber() {
    if (typeof this.val !== "number") {
      throw new Error(`Not a number: ${this.val}`);
    }
    return this.val;
  }
  toString() {
    return this.val.toString();
  }
  toResource() {
    if (typeof this.val == "string") {
      return this.val;
    }
    if (typeof this.val == "object") {
      return this.val;
    }
    if (typeof this.val !== "object") {
      throw new Error(`Not a resource: ${this.val}`);
    }
    throw new Error(`Not a resource: ${this.val}`);
  }
  value() {
    return this.val;
  }
}
