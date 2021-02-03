import { parseJsonADResource } from './parse';
import { Resource } from './store';

/** Fetches and Parses a Resource */
export async function fetchResource(subject: string): Promise<Resource> {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/ad+json');
  const response = await window.fetch(subject, {
    headers: requestHeaders,
  });
  const body = await response.text();
  const resource = parseJsonADResource(body);
  return resource;
}
