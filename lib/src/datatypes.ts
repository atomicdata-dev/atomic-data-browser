import { urls } from './urls';
import { tryValidURL } from './client';
import { JSVals, Value } from './value';

/** Each possible Atomic Datatype. See https://atomicdata.dev/collections/datatype */
// TODO: use strings from `./urls`, requires TS fix: https://github.com/microsoft/TypeScript/issues/40793
export enum Datatype {
  ATOMIC_URL = 'https://atomicdata.dev/datatypes/atomicURL',
  BOOLEAN = 'https://atomicdata.dev/datatypes/boolean',
  DATE = 'https://atomicdata.dev/datatypes/date',
  FLOAT = 'https://atomicdata.dev/datatypes/float',
  INTEGER = 'https://atomicdata.dev/datatypes/integer',
  MARKDOWN = 'https://atomicdata.dev/datatypes/markdown',
  RESOURCEARRAY = 'https://atomicdata.dev/datatypes/resourceArray',
  SLUG = 'https://atomicdata.dev/datatypes/slug',
  STRING = 'https://atomicdata.dev/datatypes/string',
  TIMESTAMP = 'https://atomicdata.dev/datatypes/timestamp',
  UNKNOWN = 'unknown',
}

/** Convert a URL to a Datatype */
export const datatypeFromUrl = (url: string): Datatype => {
  switch (url) {
    case urls.datatypes.atomicUrl: {
      return Datatype.ATOMIC_URL;
    }
    case urls.datatypes.boolean: {
      return Datatype.BOOLEAN;
    }
    case urls.datatypes.date: {
      return Datatype.DATE;
    }
    case urls.datatypes.float: {
      return Datatype.FLOAT;
    }
    case urls.datatypes.integer: {
      return Datatype.INTEGER;
    }
    case urls.datatypes.markdown: {
      return Datatype.MARKDOWN;
    }
    case urls.datatypes.resourceArray: {
      return Datatype.RESOURCEARRAY;
    }
    case urls.datatypes.slug: {
      return Datatype.SLUG;
    }
    case urls.datatypes.string: {
      return Datatype.STRING;
    }
    case urls.datatypes.timestamp: {
      return Datatype.TIMESTAMP;
    }
    default: {
      return Datatype.UNKNOWN;
    }
  }
};

const slug_regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface ArrayError extends Error {
  index?: number;
}

/** Validates a value and its datatype. Throws an error if things are wrong. */
export const validate = (value: JSVals, datatype: Datatype): Value => {
  let err = null;
  switch (datatype) {
    case Datatype.STRING: {
      if (!isString(value)) {
        err = 'Not a string';
        break;
      }
      break;
    }
    case Datatype.SLUG: {
      if (!isString(value)) {
        err = 'Not a slug, not even a string';
        break;
      }
      if (value.match(slug_regex) == null) {
        err = 'Not a valid slug. Only lowercase letters and numbers with dashes `-` between them';
      }
      break;
    }
    case Datatype.ATOMIC_URL: {
      if (!isString(value)) {
        err = 'Not a string. Should be a URL';
        break;
      }
      tryValidURL(value);
      break;
    }
    case Datatype.RESOURCEARRAY: {
      if (!isArray(value)) {
        err = 'Not an array';
        break;
      }
      value.map((item, index) => {
        try {
          tryValidURL(item);
        } catch (e) {
          const arrError: ArrayError = new Error(`Invalid URL`);
          arrError.index = index;
          throw arrError;
        }
      });
      break;
    }
    case Datatype.INTEGER: {
      if (!isNumber(value)) {
        err = 'Not a number';
        break;
      }
      if (value % 1 !== 0) {
        err = 'Not an integer';
      }
      break;
    }
  }
  if (err !== null) {
    throw new Error(`${err}`);
  }
  return new Value(value);
};

function isArray(val: JSVals): val is [] {
  return Object.prototype.toString.call(val) === '[object Array]';
}

function isString(val: JSVals): val is string {
  return typeof val === 'string';
}

function isNumber(val: JSVals): val is number {
  return typeof val === 'number';
}
