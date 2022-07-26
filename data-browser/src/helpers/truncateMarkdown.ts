export function truncateMarkdown(value: string, length: number) {
  if (value.length <= length) {
    return value;
  }

  const head = value.slice(0, length);

  if (head.endsWith('\n')) {
    return head + '...';
  }

  const tail = value.slice(length);
  const firstNewLine = tail.indexOf('\n');

  return (
    value.slice(
      0,
      length + (firstNewLine === -1 ? tail.length : firstNewLine),
    ) + '...'
  );
}
