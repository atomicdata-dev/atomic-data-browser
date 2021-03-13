import { Commit, serializeDeterministically } from './commit';
import { parseJsonADResource } from './parse';
import { Resource, ResourceStatus } from './resource';

/**
 * Fetches and Parses a Resource. Can fetch through another atomic server if you pass the `from` argument, which should be the baseURL of
 * an Atomic Server. Does not add it to the store. If you need that, use `Store.fetchResource`.
 */
export async function fetchResource(
  subject: string,
  /** Base URL of an atomic server. Uses the `/path` endpoint to indirectly fetch through that server. */
  from?: string,
): Promise<Resource> {
  const resource = new Resource(subject);
  // We set the status to ready. This is overwrited when an error happens.
  resource.setStatus(ResourceStatus.ready);
  try {
    if (!checkValidURL(subject)) {
      const err = new Error(`Invalid URL: ${subject}`);
      resource.setError(err);
    }
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', 'application/ad+json');
    let url = subject;
    if (from !== undefined) {
      url = `${from}/path?${subject}`;
    }
    const response = await window.fetch(url, {
      headers: requestHeaders,
    });
    const body = await response.text();
    if (response.status == 200) {
      parseJsonADResource(body, resource);
    } else {
      const error = new Error(`${subject} returned ${response.status}. Server: ${body}`);
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
  try {
    const response = await window.fetch(endpoint, {
      headers: requestHeaders,
      method: 'POST',
      body: serialized,
    });
    const body = await response.text();
    if (response.status !== 200) {
      throw new Error(`Commit failed. Server replied with ${response.status}: ${body}`);
    }
    return body;
  } catch (e) {
    throw new Error(`Posting Commit to ${endpoint} failed: ${e}`);
  }
}

/** Throws an error if the URL is not valid */
export function checkValidURL(subject: string): boolean {
  try {
    new URL(subject);
  } catch {
    throw new Error(`Not a valid URL: ${subject}`);
  }
  return true;
}
