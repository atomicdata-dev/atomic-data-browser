import {parseJsonADResource} from "./parse.js";
import {Resource} from "./resource.js";
export async function fetchResource(subject) {
  const resource = new Resource(subject);
  if (!checkValidURL(subject)) {
    const err = new Error(`Invalid URL: ${subject}`);
    resource.setError(err);
  }
  const requestHeaders = new Headers();
  requestHeaders.set("Accept", "application/ad+json");
  const response = await window.fetch(subject, {
    headers: requestHeaders
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
export function checkValidURL(subject) {
  try {
    new URL(subject);
  } catch {
    throw new Error(`Not a valid URL: ${subject}`);
    return false;
  }
  return true;
}
