import {serializeDeterministically} from "./commit.js";
import {parseJsonADResource} from "./parse.js";
import {Resource, ResourceStatus} from "./resource.js";
export async function fetchResource(subject, from) {
  const resource = new Resource(subject);
  resource.setStatus(ResourceStatus.ready);
  try {
    if (!checkValidURL(subject)) {
      const err = new Error(`Invalid URL: ${subject}`);
      resource.setError(err);
    }
    const requestHeaders = new Headers();
    requestHeaders.set("Accept", "application/ad+json");
    let url = subject;
    if (from !== void 0) {
      const newURL = new URL(`${from}/path`);
      newURL.searchParams.set("path", subject);
      url = newURL.href;
    }
    const response = await window.fetch(url, {
      headers: requestHeaders
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
export async function postCommit(commit, endpoint) {
  const serialized = serializeDeterministically(commit);
  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/ad+json");
  try {
    const response = await window.fetch(endpoint, {
      headers: requestHeaders,
      method: "POST",
      body: serialized
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
export function checkValidURL(subject) {
  try {
    new URL(subject);
  } catch {
    throw new Error(`Not a valid URL: ${subject}`);
  }
  return true;
}
