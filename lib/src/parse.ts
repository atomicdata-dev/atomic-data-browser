import { Resource, ResourceStatus, unknownSubject } from './resource';
import { JSONObject, Value } from './value';

/** Parses an JSON-AD object containing a resoure, adds it to the input Resource */
export function parseJsonADResource(
  jsonObject: JSONObject,
  resource: Resource,
): void {
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
      try {
        const path = resource.getSubject() + ' ' + key;
        const val = new Value(jsonObject[key], path);
        resource.setUnsafe(key, val);
      } catch (e) {
        throw new Error(
          `Failed creating value for key ${key} in resource ${resource.getSubject()}. ${e.message
          }`,
        );
      }
    }
    resource.setStatus(ResourceStatus.ready);
  } catch (e) {
    e.message = 'Failed parsing JSON ' + e.message;
    resource.setError(e);
    throw e;
  }
  return;
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
