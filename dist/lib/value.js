export class Value {
  constructor(val) {
    this.val = val;
  }
  toArray() {
    if (this.val.constructor == Array) {
      return this.val;
    }
    throw new Error(`Not an array: ${this.val}`);
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
  toString() {
    return this.val.toString();
  }
  toResource() {
    if (typeof this.val == "string") {
      return this.val;
    }
    return this.val;
  }
  value() {
    return this.val;
  }
}
