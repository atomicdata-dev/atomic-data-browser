import { Commit, serializeDeterministically } from './commit';
import { parseJsonADResource } from './parse';
import { Resource } from './resource';

/**
 * Fetches and Parses a Resource. Can fetch through another atomic server if you
 * pass the `from` argument, which should be the baseURL of an Atomic Server.
 * Does not add it to the store. If you need that, use `Store.fetchResource`.
 */
export async function fetchResource(
  subject: string,
  /**
   * Base URL of an atomic server. Uses the `/path` endpoint to indirectly fetch
   * through that server.
   */
  from?: string,
): Promise<Resource> {
  const resource = new Resource(subject);
  try {
    tryValidURL(subject);
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', 'application/ad+json');
    let url = subject;
    if (from !== undefined) {
      const newURL = new URL(`${from}/path`);
      newURL.searchParams.set('path', subject);
      url = newURL.href;
    }
    if (window.fetch == undefined) {
      throw new Error(
        `No window object available this lib currently requires the DOM for fetching`,
      );
    }
    const response = await window.fetch(url, {
      headers: requestHeaders,
    });
    const body = await response.text();
    if (response.status == 200) {
      const json = JSON.parse(body);
      parseJsonADResource(json, resource);
    } else {
      const error = new Error(`${response.status} error: ${body}`);
      resource.setError(error);
    }
  } catch (e) {
    resource.setError(e);
  }
  return resource;
}

/** Posts a Commit to some endpoint */
export async function postCommit(
  commit: Commit,
  /** URL to post to, e.g. https://atomicdata.dev/commit */
  endpoint: string,
): Promise<string> {
  const serialized = serializeDeterministically(commit);
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/ad+json');
  let response = null;
  try {
    response = await window.fetch(endpoint, {
      headers: requestHeaders,
      method: 'POST',
      body: serialized,
    });
  } catch (e) {
    throw new Error(`Posting Commit to ${endpoint} failed: ${e}`);
  }
  const body = await response.text();
  if (response.status !== 200) {
    throw new Error(body);
  }
  return body;
}

/** Throws an error if the URL is not valid */
export function tryValidURL(subject: string): void {
  try {
    new URL(subject);
  } catch (e) {
    throw new Error(`Not a valid URL: ${subject}. ${e}`);
  }
}

/** Returns true if a URL is valid. */
export function isValidURL(subject: string): boolean {
  try {
    tryValidURL(subject);
    return true;
  } catch (e) {
    return false;
  }
}
