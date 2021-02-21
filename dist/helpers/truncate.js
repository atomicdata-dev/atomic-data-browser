export function truncateUrl(url, num) {
  const noSchema = url.replace(/(^\w+:|^)\/\//, "");
  if (noSchema.length <= num) {
    return noSchema;
  }
  return noSchema.slice(0, num) + "...";
}
