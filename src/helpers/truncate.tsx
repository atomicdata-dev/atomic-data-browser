/** Makes URLs shorter and removes the schema. Hides the hostname if it's equal to the window hostname */
export function truncateUrl(url: string, num: number): string {
  // Remove the schema, the https:// part
  let noSchema = url.replace(/(^\w+:|^)\/\//, '');
  if (noSchema.startsWith(window.location.hostname)) {
    noSchema = noSchema.slice(window.location.hostname.length);
  }
  if (noSchema.length <= num) {
    return noSchema;
  }
  return noSchema.slice(0, num) + '...';
}
