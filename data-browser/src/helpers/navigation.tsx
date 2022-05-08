import { useSearchParams } from 'react-router-dom';
import { paths } from '../routes/paths';

/** Constructs a URL string with a route, a query Parameter and a value */
function constructURL(
  /** The base path, e.g. '/new' */
  path: string,
  /** The query parameter key, e.g. 'subject' for '/new?subject={}' */
  queryParam: string,
  /** The actual value, e.g. 'https://example.com/myReosource' */
  value: string,
): string {
  const navTo = new URL(location.origin);
  navTo.pathname = path;
  navTo.searchParams.append(queryParam, value);
  return path + navTo.search;
}

/** Constructs a URL for opening / showing a Resource. */
export function openURL(subject: string): string {
  const url = new URL(subject);
  if (window.location.origin == url.origin) {
    const path = url.pathname + url.search;
    if (path == '/') return '';
    return path;
  } else {
    return constructURL(paths.show, 'subject', subject);
  }
}

export function searchURL(query: string): string {
  return constructURL(paths.search, 'query', query);
}

type setFunc = (latestValue: string) => void;

/** Returns a getter and a setter for query parameters */
export function useQueryString(key: string): [string, setFunc] {
  const [params, set] = useSearchParams(key);
  const customSet = (subject: string) => {
    set(subject);
  };
  return [params.get(key), customSet];
}

/** A hook containing a getter and a setter for the current 'query' search param */
// eslint-disable-next-line
export function useSearchQuery() {
  return useQueryString('query');
}

/** Constructs a URL for the New Resource form */
export function newURL(
  classUrl: string,
  parentURL?: string,
  subject?: string,
): string {
  const navTo = new URL(location.origin);
  navTo.pathname = paths.new;
  navTo.searchParams.append('classSubject', classUrl);
  parentURL && navTo.searchParams.append('parent', parentURL);
  subject && navTo.searchParams.append('newSubject', subject);
  return paths.new + navTo.search;
}

export function editURL(subject: string): string {
  return constructURL(paths.edit, 'subject', subject);
}

export function shareURL(subject: string): string {
  return constructURL(paths.share, 'subject', subject);
}

export function dataURL(subject: string): string {
  return constructURL(paths.data, 'subject', subject);
}

export function pathToURL(path: string): string {
  return window.location.origin + path;
}

/**
 * Constructs the URL for the `all-versions` endpoint. Assumes the current URL
 * supports that endpoint
 */
export function versionsURL(subject: string, baseURL: string): string {
  const url = new URL(baseURL);
  url.pathname = paths.allVersions;
  url.searchParams.append('subject', subject);
  return openURL(url.toString());
}

/** Takes the cursor position, finds the nearest `about=` attributes in DOM nodes */
export function getSubjectFromDom(): string | null {
  const found: string[] = [];
  // NodeList of items that the mouse is currently over in document order. The last element in the NodeList is the most specific, each preceding one should be a parent.
  const nodeList = document.querySelectorAll(':hover');
  nodeList.forEach(node => {
    // The about attirbute should contain a Subject
    const about = node.getAttribute('about');
    if (about !== null) {
      found.unshift(about);
    }
  });
  return found[0];
}
