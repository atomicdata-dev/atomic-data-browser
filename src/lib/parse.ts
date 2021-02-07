import { handleError } from '../helpers/handlers';
import { Resource, ResourceStatus } from './resource';
import { Value } from './value';

/** Parses an JSON-AD string containing a resoure, adds it to the input Resource */
export function parseJsonADResource(string: string, resource: Resource): void {
  try {
    const jsonObject = JSON.parse(string);
    for (const key in jsonObject) {
      if (key == '@id') {
        const subject: string = jsonObject['@id'];
        if (typeof subject !== 'string') {
          throw new Error("'@id' field must be a string");
        }
        resource.setSubject(subject);
        continue;
      }
      resource.set(key, new Value(jsonObject[key]));
    }
    resource.setStatus(ResourceStatus.ready);
  } catch (e) {
    resource.setError(e);
    handleError(e);
  }
  return;
}
