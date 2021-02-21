function constructURL(path, queryParam, value) {
  const navTo = new URL(location.origin);
  navTo.pathname = path;
  navTo.searchParams.append(queryParam, value);
  return path + navTo.search;
}
export function openURL(subject) {
  return constructURL("/show", "subject", subject);
}
export function newURL(classUrl) {
  return constructURL("/new", "classSubject", classUrl);
}
export function editURL(subject) {
  return constructURL("/edit", "subject", subject);
}
export function dataURL(subject) {
  return constructURL("/data", "subject", subject);
}
export function getSubjectFromDom() {
  const found = [];
  const nodeList = document.querySelectorAll(":hover");
  nodeList.forEach((node) => {
    const about = node.getAttribute("about");
    if (about !== null) {
      found.unshift(about);
    }
  });
  return found[0];
}
