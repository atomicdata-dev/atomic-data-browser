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

export function openURL(subject: string): string {
  return constructURL('/show', 'subject', subject);
}

export function newURL(classUrl: string, parentURL?: string): string {
  // TODO: handle parentURL
  return constructURL('/new', 'classSubject', classUrl);
}

export function editURL(subject: string): string {
  return constructURL('/edit', 'subject', subject);
}

export function dataURL(subject: string): string {
  return constructURL('/data', 'subject', subject);
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
