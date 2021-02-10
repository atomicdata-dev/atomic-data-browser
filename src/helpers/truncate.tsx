/** Makes URLs shorter and removes the schema */
export function truncateUrl(url: string, num: number): string {
  console.log('truncate', url);
  const noSchema = url.replace(/(^\w+:|^)\/\//, '');
  if (noSchema.length <= num) {
    return noSchema;
  }
  return noSchema.slice(0, num) + '...';
}
