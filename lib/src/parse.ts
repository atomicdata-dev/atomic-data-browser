import { isArray, JSONValue, Store } from '.';
import { Resource, unknownSubject } from './resource';
import { JSONObject } from './value';

/**
 * Parses an JSON-AD object containing a resoure, adds it to the input Resource.
 * Also adds it to the store, if you pass a `store`.
 */
export function parseJsonADResource(
  jsonObject: JSONObject,
  resource: Resource,
  /** Pass a Store if you want to add the parsed resources to it */
  store?: Store,
): Resource {
  try {
    for (const key in jsonObject) {
      if (key == '@id') {
        const subject = jsonObject['@id'];
        if (typeof subject !== 'string') {
          throw new Error("'@id' field must be a string");
        }
        if (
          resource.getSubject() !== 'undefined' &&
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
            parseJsonAdResourceValue(store, val, resource, key),
          );
          resource.setUnsafe(key, newarr);
        } else if (typeof value === 'string') {
          resource.setUnsafe(key, value);
        } else if (typeof value === 'number') {
          resource.setUnsafe(key, value);
        } else if (typeof value === 'boolean') {
          resource.setUnsafe(key, value);
        } else {
          const subject = parseJsonAdResourceValue(store, value, resource, key);
          resource.setUnsafe(key, subject);
        }
      } catch (e) {
        throw new Error(
          `Failed creating value ${value} for key ${key} in resource ${resource.getSubject()}. ${
            e.message
          }`,
        );
      }
    }
    resource.loading == false;
    store && store.addResource(resource);
  } catch (e) {
    e.message = 'Failed parsing JSON ' + e.message;
    resource.setError(e);
    resource.loading == false;
    store && store.addResource(resource);
    throw e;
  }
  return resource;
}

type StringOrNestedResource = string | JSONObject;

/**
 * Parses a JSON-AD Value. If it's a string, it takes its URL. If it's an
 * Object, it will parse it as a Resource. It will add the string property to
 * the Resource.
 */
function parseJsonAdResourceValue(
  store: Store,
  value: JSONValue,
  resource: Resource,
  key: string,
): StringOrNestedResource {
  if (typeof value === 'string') {
    return value;
  }
  if (value.constructor === {}.constructor) {
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
export function parseJsonADArray(jsonArray: any[]): Resource[] {
  const resources: Resource[] = [];
  try {
    // const jsonArray = JSON.parse(string);
    for (const jsonObject of jsonArray) {
      const resource = new Resource(unknownSubject);
      parseJsonADResource(jsonObject, resource);
      resources.push(resource);
    }
  } catch (e) {
    e.message = 'Failed parsing JSON ' + e.message;
    throw e;
  }
  return resources;
}
