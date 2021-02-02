/** All the types that a Value might contain */
type JSVals = string | Date | number;

/** Atomic Data Value. Can be any https://atomicdata.dev/classes/Datatype */
class Value {
  val: JSVals;

  constructor(val: JSVals) {
    this.val = val;
  }

  toString(): string {
    return this.val.toString();
  }
}

/** An in memory store that has a bunch of useful methods for retrieving and */
export class Store {
  base_url: string;
  resources: Map<string, Resource>;

  constructor(base_url: string) {
    this.base_url = base_url;
    this.resources = new Map();
  }

  /** Adds a bunch of predetermined Resources to the store */
  populate(): void {
    const resource = new Resource('mySubject');
    resource.set('myProp', new Value('myVal'));
    this.addResource(resource);
  }

  /** Adds a Resource to the store */
  addResource(resource: Resource): void {
    this.resources.set(resource.subject, resource);
  }

  /** Gets a resource by URL */
  getResource(subject: string): Resource {
    return this.resources.get(subject);
  }

  /** Returns the URL of the companion server */
  getBaseUrl(): string {
    return 'Store base url is ' + this.base_url;
  }
}

/** Describes an Atomic Resource, which has a Subject URL and a bunch of Property / Value combinations. */
class Resource {
  subject: string;
  propvals: Map<string, Value>;

  constructor(subject: string) {
    this.subject = subject;
    this.propvals = new Map();
  }

  /** Get a Value by its property */
  get(propUrl: string): Value {
    return this.propvals.get(propUrl);
  }

  /** Set a Property, Value combination */
  set(prop: string, val: Value) {
    this.propvals.set(prop, val);
  }
}
