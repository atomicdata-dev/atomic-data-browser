export function openURL(subject: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/';
  navTo.searchParams.append('subject', subject);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}

export function newURL(classUrl: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/new';
  navTo.searchParams.append('classSubject', classUrl);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}

export function editURL(subject: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/edit';
  navTo.searchParams.append('subject', subject);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}

export function dataURL(subject: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/data';
  navTo.searchParams.append('subject', subject);
  const path = navTo.pathname.toString();
  return path + navTo.search;
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
