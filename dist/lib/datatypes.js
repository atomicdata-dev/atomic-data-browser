import {urls} from "../helpers/urls.js";
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
