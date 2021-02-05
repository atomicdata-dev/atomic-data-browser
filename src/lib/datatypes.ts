import { urls } from '../helpers/urls';

export enum Datatype {
  ATOMIC_URL,
  BOOLEAN,
  DATE,
  FLOAT,
  INTEGER,
  MARKDOWN,
  RESOURCEARRAY,
  SLUG,
  STRING,
  TIMESTAMP,
  UNKNOWN,
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
      return Datatype.STRING;
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
