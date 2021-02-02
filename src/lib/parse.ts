import { Resource } from './store';

/** Parses an JSON-AD string containing a resoure */
export function parseJsonADResource(string: string): Resource {
  const jsonObject = JSON.parse(string);
  const subject: string = jsonObject['@id'];
  // TODO: add the atoms
  const resource = new Resource(subject);
  return resource;
}
