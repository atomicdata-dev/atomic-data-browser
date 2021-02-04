/** All the types that a Value might contain */
type JSVals = string | Date | number;

export enum Datatype {
  MARKDOWN,
  STRING,
}

/** Atomic Data Value. Can be any datatype: https://atomicdata.dev/classes/Datatype */
export class Value {
  private datatype: Datatype;
  private val: JSVals;

  /** Createes a new Vales, makes (possibly incorrect) assumptions about its Datatype based on the input value */
  constructor(val: JSVals) {
    this.val = val;
    this.datatype = Datatype.STRING;
  }

  setDatatype(datatype: Datatype): void {
    this.datatype = datatype;
  }

  getDatatype(): Datatype {
    return this.datatype;
  }

  toString(): string {
    return this.val.toString();
  }
}
