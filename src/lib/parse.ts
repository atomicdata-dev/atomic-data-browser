import { Resource } from './store';

/** Parses an JSON-AD string containing a resoure */
export function parseJsonADResource(string: string): Resource {
  const jsonObject = JSON.parse(string);
  // TODO: add the atoms
  const subject: string = jsonObject['@id'];
  if (typeof subject !== 'string') {
    throw "Object has no subject, should be set with '@id'";
  }
  console.log('PARSED');
  const resource = new Resource(subject);
  for (const key in jsonObject) {
    resource.set(key, jsonObject[key]);
  }
  console.log('resource', resource);
  return resource;
}
