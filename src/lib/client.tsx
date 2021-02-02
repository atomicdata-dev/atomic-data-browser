import { parseJsonADResource } from './parse';
import { Resource } from './store';

/** Fetches and Parses a Resource */
export async function fetchResource(subject: string): Promise<Resource> {
  const response = await window.fetch(subject);
  const body = await response.text();
  const resource = parseJsonADResource(body);
  return resource;
}
