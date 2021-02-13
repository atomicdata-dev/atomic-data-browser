export function handleError(e: Error): void {
  console.error(e);
}

export function handleWarning(e: unknown): void {
  console.warn(e);
}

export function handleInfo(e: Error): void {
  console.info(e);
}
