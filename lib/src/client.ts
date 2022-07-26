// Provides functionality to interact with an Atomic Server.

import {
  Agent,
  AtomicError,
  Commit,
  ErrorType,
  getTimestampNow,
  parseCommit,
  parseJsonADArray,
  parseJsonADResource,
  Resource,
  serializeDeterministically,
  signToBase64,
  Store,
} from './index';

/** Works both in node and the browser */
import fetch from 'cross-fetch';

/**
 * One key-value pair per HTTP Header. Since we need to support both browsers
 * and Node, we won't use the native Headers object here.
 */
interface HeadersObject {
  [key: string]: string;
}

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
   * Pass a server URL if you want to use the `/path` endpoint to indirectly
   * fetch through that server.
   */
  from?: string,
): Promise<Resource> {
  let resource = new Resource(subject);
  try {
    tryValidURL(subject);
    const requestHeaders: HeadersObject = {};
    requestHeaders['Accept'] = 'application/ad+json';
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
    if (fetch == undefined) {
      throw new AtomicError(
        `No window object available this lib currently requires the DOM for fetching`,
      );
    }
    const response = await fetch(url, {
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

/** Posts a Commit to some endpoint. Returns the Commit created by the server. */
export async function postCommit(
  commit: Commit,
  /** URL to post to, e.g. https://atomicdata.dev/commit */
  endpoint: string,
): Promise<Commit> {
  const serialized = serializeDeterministically({ ...commit });
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/ad+json');
  let response = null;
  try {
    response = await fetch(endpoint, {
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
  return parseCommit(body);
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
  return subject?.split('?')[0];
}

/**
 * Creates authentication headers and signs the request. Does not add headers if
 * the Agents subject is missing.
 */
export async function signRequest(
  /** The resource meant to be fetched */
  subject: string,
  agent: Agent,
  headers: HeadersObject | Headers,
): Promise<HeadersObject> {
  // If you're using a local Agent, you cannot authenticate requests to other domains.
  const localTryingExternal =
    !subject.startsWith('http://localhost') &&
    agent?.subject?.startsWith('http://localhost');
  if (agent?.subject && !localTryingExternal) {
    const privateKey = agent.privateKey;
    const timestamp = getTimestampNow();
    const message = `${subject} ${timestamp}`;
    const signed = await signToBase64(message, privateKey);
    headers['x-atomic-public-key'] = await agent.getPublicKey();
    headers['x-atomic-signature'] = signed;
    headers['x-atomic-timestamp'] = timestamp.toString();
    headers['x-atomic-agent'] = agent?.subject;
  }
  return headers as HeadersObject;
}

/**
 * Uploads files to the `/upload` endpoint of the Store. Signs the Headers using
 * the Store's Default Agent. Adds the created File resources to the Store.
 * Returns the subjects of these newly created File resources.
 */
export async function uploadFiles(
  files: File[],
  store: Store,
  parent: string,
): Promise<string[]> {
  const formData = new FormData();

  files.map(file => {
    formData.append('assets', file, file.name);
  });

  const uploadURL = new URL(store.getServerUrl() + '/upload');
  uploadURL.searchParams.set('parent', parent);
  const signedHeaders = await signRequest(
    uploadURL.toString(),
    store.getAgent(),
    {},
  );

  const options = {
    method: 'POST',
    body: formData,
    headers: signedHeaders,
  };

  const resp = await fetch(uploadURL.toString(), options);
  const body = await resp.text();
  if (resp.status !== 200) {
    throw Error(body);
  }
  const json = JSON.parse(body);
  const resources = parseJsonADArray(json);
  const fileSubjects = [];
  for (const r of resources) {
    store.addResource(r);
    fileSubjects.push(r.getSubject());
  }
  return fileSubjects;
}
