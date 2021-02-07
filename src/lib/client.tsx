import { parseJsonADResource } from './parse';
import { Resource } from './resource';

/** Fetches and Parses a Resource. Does not add it to the store. If you need that, use `Store.fetchResource`. */
export async function fetchResource(subject: string): Promise<Resource> {
  const resource = new Resource(subject);
  if (!checkValidURL(subject)) {
    const err = new Error(`Invalid URL: ${subject}`);
    resource.setError(err);
  }
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/ad+json');
  const response = await window.fetch(subject, {
    headers: requestHeaders,
  });
  const body = await response.text();
  if (response.status == 200) {
    parseJsonADResource(body, resource);
  } else {
    const error = new Error(`${subject} returned ${response.status}`);
    resource.setError(error);
  }
  return resource;
}

/** Throws an error if the URL is not valid */
export function checkValidURL(subject: string): boolean {
  try {
    new URL(subject);
  } catch {
    throw new Error(`Not a valid URL: ${subject}`);
    return false;
  }
  return true;
}
