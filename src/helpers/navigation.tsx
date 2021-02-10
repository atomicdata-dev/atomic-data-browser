export function createSubjectUrl(subject: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/';
  navTo.searchParams.append('subject', subject);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}

export function createInstanceUrl(classUrl: string): string {
  const navTo = new URL(location.origin);
  navTo.pathname = '/new';
  navTo.searchParams.append('classSubject', classUrl);
  const path = navTo.pathname.toString();
  return path + navTo.search;
}
