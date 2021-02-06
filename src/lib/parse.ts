import { Resource } from './resource';
import { Value } from './value';

/** Parses an JSON-AD string containing a resoure */
export function parseJsonADResource(string: string): Resource {
  const jsonObject = JSON.parse(string);
  const resource = new Resource('no_@id');
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
  return resource;
}
