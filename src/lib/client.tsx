import { parseJsonADResource } from './parse';
import { Resource } from './resource';

/** Fetches and Parses a Resource */
export async function fetchResource(subject: string): Promise<Resource> {
  checkValidURL(subject);
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/ad+json');
  const response = await window.fetch(subject, {
    headers: requestHeaders,
  });
  const body = await response.text();
  const resource = parseJsonADResource(body);
  return resource;
}

export function checkValidURL(subject: string): void {
  try {
    new URL(subject);
  } catch {
    throw new Error(`Not a valid URL: ${subject}`);
  }
}
