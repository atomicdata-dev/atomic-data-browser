import { AtomicError } from './error';
import { urls } from './urls';
import { isArray, JSONValue, Store } from './index';
import { Resource, unknownSubject } from './resource';
import { JSONObject } from './value';

/**
 * Parses an JSON-AD object containing a resource, adds it to the input
 * Resource. Also adds it to the store, if you pass a `store`.
 */
export function parseJsonADResource(
  jsonObject: JSONObject,
  resource: Resource,
  /** Pass a Store if you want to add the parsed resources to it */
  store?: Store,
): Resource {
  try {
    for (const key in jsonObject) {
      if (key === '@id') {
        const subject = jsonObject['@id'];

        if (typeof subject !== 'string') {
          throw new Error("'@id' field must be a string");
        }

        if (
          resource.getSubject() !== 'undefined' &&
          resource.getSubject() !== unknownSubject &&
          subject !== resource.getSubject()
        ) {
          throw new Error(
            `Resource has wrong subject in @id. Received subject was ${subject}, expected ${resource.getSubject()}.`,
          );
        }

        resource.setSubject(subject);
        continue;
      }

      const value = jsonObject[key];

      try {
        // Resource values can be either strings (URLs) or full Resources, which in turn can be either Anonymous (no @id) or Named (with an @id)
        if (isArray(value)) {
          const newarr = value.map(val =>
            parseJsonAdResourceValue(val, resource, key, store),
          );
          resource.setUnsafe(key, newarr);
        } else if (typeof value === 'string') {
          resource.setUnsafe(key, value);
        } else if (typeof value === 'number') {
          resource.setUnsafe(key, value);
        } else if (typeof value === 'boolean') {
          resource.setUnsafe(key, value);
        } else {
          const subject = parseJsonAdResourceValue(value, resource, key, store);
          resource.setUnsafe(key, subject);
        }
      } catch (e) {
        const baseMsg = `Failed creating value ${value} for key ${key} in resource ${resource.getSubject()}`;
        const errorMsg = `${baseMsg}. ${e.message}`;
        throw new Error(errorMsg);
      }
    }

    resource.loading = false;

    if (resource.getClasses().includes(urls.classes.error)) {
      resource.error = AtomicError.fromResource(resource);
    }

    if (store) {
      store.addResource(resource);
    }
  } catch (e) {
    e.message = 'Failed parsing JSON ' + e.message;
    resource.setError(e);
    resource.loading = false;

    if (store) {
      store.addResource(resource);
    }

    throw e;
  }

  return resource;
}

/** Resources in JSON-AD can be referenced by their URL (string),
 * be entire (nested) resources, in which case they are JSONObjects */
type StringOrNestedResource = string | JSONObject;

/**
 * Parses a JSON-AD Value. If it's a string, it takes its URL. If it's an
 * Object, it will parse it as a Resource. It will add the string property to
 * the Resource.
 */
export function parseJsonAdResourceValue(
  value: JSONValue,
  resource: Resource,
  key: string,
  store?: Store,
): StringOrNestedResource {
  if (typeof value === 'string') {
    return value;
  }

  if (value?.constructor === {}.constructor) {
    if (Object.keys(value).includes('@id')) {
      // It's a named resource that needs to be put in the store
      const nestedSubject = value['@id'];
      const nestedResource = new Resource(nestedSubject);
      parseJsonADResource(value as JSONObject, nestedResource, store);

      return nestedSubject;
    } else {
      // It's an anonymous nested Resource
      return value as JSONObject;
    }
  }

  throw new Error(`Value ${value} in ${key} not a string or a nested Resource`);
}

/** Parsees a JSON-AD array string, returns array of Resources */
export function parseJsonADArray(jsonArray: unknown[]): Resource[] {
  const resources: Resource[] = [];

  try {
    // const jsonArray = JSON.parse(string);
    for (const jsonObject of jsonArray) {
      const resource = new Resource(unknownSubject);
      parseJsonADResource(jsonObject as JSONObject, resource);
      resources.push(resource);
    }
  } catch (e) {
    e.message = 'Failed parsing JSON ' + e.message;
    throw e;
  }

  return resources;
}
