import {urls} from "../helpers/urls.js";
import {checkValidURL} from "./client.js";
import {Value} from "./value.js";
export var Datatype;
(function(Datatype2) {
  Datatype2[Datatype2["ATOMIC_URL"] = 0] = "ATOMIC_URL";
  Datatype2[Datatype2["BOOLEAN"] = 1] = "BOOLEAN";
  Datatype2[Datatype2["DATE"] = 2] = "DATE";
  Datatype2[Datatype2["FLOAT"] = 3] = "FLOAT";
  Datatype2[Datatype2["INTEGER"] = 4] = "INTEGER";
  Datatype2[Datatype2["MARKDOWN"] = 5] = "MARKDOWN";
  Datatype2[Datatype2["RESOURCEARRAY"] = 6] = "RESOURCEARRAY";
  Datatype2[Datatype2["SLUG"] = 7] = "SLUG";
  Datatype2[Datatype2["STRING"] = 8] = "STRING";
  Datatype2[Datatype2["TIMESTAMP"] = 9] = "TIMESTAMP";
  Datatype2[Datatype2["UNKNOWN"] = 10] = "UNKNOWN";
})(Datatype || (Datatype = {}));
export const datatypeFromUrl = (url) => {
  switch (url) {
    case urls.datatypes.atomicUrl: {
      return 0;
    }
    case urls.datatypes.boolean: {
      return 1;
    }
    case urls.datatypes.date: {
      return 2;
    }
    case urls.datatypes.float: {
      return 3;
    }
    case urls.datatypes.integer: {
      return 8;
    }
    case urls.datatypes.markdown: {
      return 5;
    }
    case urls.datatypes.resourceArray: {
      return 6;
    }
    case urls.datatypes.slug: {
      return 7;
    }
    case urls.datatypes.string: {
      return 8;
    }
    case urls.datatypes.timestamp: {
      return 9;
    }
    default: {
      return 10;
    }
  }
};
const slug_regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const validate = (value, datatype) => {
  let err = null;
  switch (datatype) {
    case 8: {
      if (!isString(value)) {
        err = "Not a string";
        break;
      }
      break;
    }
    case 7: {
      if (!isString(value)) {
        err = "Not a slug, not even a string";
        break;
      }
      if (value.match(slug_regex) == null) {
        err = "Not a valid slug. Only lowercase letters and numbers with dashes `-` between them";
      }
      break;
    }
    case 0: {
      if (!isString(value)) {
        err = "Not a string. Should be a URL";
        break;
      }
      checkValidURL(value);
      break;
    }
    case 6: {
      if (!isArray(value)) {
        err = "Not an array";
        break;
      }
      value.map((item, index) => {
        try {
          checkValidURL(item);
        } catch (e) {
          const arrError = new Error(`Invalid URL`);
          arrError.index = index;
          throw arrError;
        }
      });
      break;
    }
    case 4: {
      if (!isNumber(value)) {
        err = "Not a number";
        break;
      }
      if (value % 1 !== 0) {
        err = "Not an integer";
      }
      break;
    }
  }
  if (err !== null) {
    throw new Error(`${err}`);
  }
  return new Value(value);
};
function isArray(val) {
  return Object.prototype.toString.call(val) === "[object Array]";
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
