import { getTimestampNow, Store } from '.';
import { Commit, serializeDeterministically, signToBase64 } from './commit';
import { parseJsonADResource } from './parse';
import { Resource } from './resource';
import { Agent } from '@tomic/lib';
import { AtomicError, ErrorType } from './error';

/**
 * Fetches and Parses a Resource. Can fetch through another atomic server if you
 * pass the `from` argument, which should be the baseURL of an Atomic Server.
 * Does not add it to the store. If you need that, use `Store.fetchResource`.
 */
export async function fetchResource(
  subject: string,
  /**
   * Pass the Store if you want to directly add the resource (and its possible
   * nested child Resources) to the Store.
   */
  store?: Store,
  /**
   * Base URL of an atomic server. Uses the `/path` endpoint to indirectly fetch
   * through that server.
   */
  from?: string,
): Promise<Resource> {
  let resource = new Resource(subject);
  try {
    tryValidURL(subject);
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', 'application/ad+json');
    // Sign the request if there is an agent present
    store &&
      store.getAgent() &&
      (await signRequest(subject, store.getAgent(), requestHeaders));
    let url = subject;
    if (from !== undefined) {
      const newURL = new URL(`${from}/path`);
      newURL.searchParams.set('path', subject);
      url = newURL.href;
    }
    if (window.fetch == undefined) {
      throw new AtomicError(
        `No window object available this lib currently requires the DOM for fetching`,
      );
    }
    const response = await window.fetch(url, {
      headers: requestHeaders,
    });
    const body = await response.text();
    if (response.status == 200) {
      try {
        const json = JSON.parse(body);
        resource = parseJsonADResource(json, resource, store);
      } catch (e) {
        throw new AtomicError(
          `Could not parse JSON from fetching ${subject}. Is it an Atomic Data resource? Error message: ${e.message}`,
        );
      }
    } else if (response.status == 401) {
      throw new AtomicError(
        `You don't have the rights to do view ${subject}. Are you signed in with the right Agent? More detailed error from server: ${body}`,
        ErrorType.Unauthorized,
      );
    } else {
      const error = new AtomicError(`${response.status} error: ${body}`);
      resource.setError(error);
    }
  } catch (e) {
    resource.setError(e);
  }
  resource.loading = false;
  store && store.addResource(resource);
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

/**
 * Removes query params from the URL if it can build a URL. Will return the
 * normal URL if things go wrong.
 */
// TODO: Not sure about this. Was done because `new Commit()` failed with `unknown-subject`.
export function removeQueryParamsFromURL(subject: string): string {
  // return subject.split('?')[0];
  return subject;
}

/** Creates an x-atomic-signature header */
async function signRequest(
  /** The resource meant to be fetched */
  subject: string,
  agent: Agent,
  headers: Headers,
): Promise<Headers> {
  const privateKey = agent.privateKey;
  const timestamp = getTimestampNow();
  const message = `${subject} ${timestamp}`;
  const signed = await signToBase64(message, privateKey);
  headers.set('x-atomic-public-key', await agent.getPublicKey());
  headers.set('x-atomic-signature', signed);
  headers.set('x-atomic-timestamp', timestamp.toString());
  headers.set('x-atomic-agent', agent?.subject);
  return headers;
}
