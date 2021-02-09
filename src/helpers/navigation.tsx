export function createSubjectUrl(subject: string) {
  const navTo = new URL(location.origin);
  navTo.pathname = '/';
  navTo.searchParams.append('subject', subject);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}
