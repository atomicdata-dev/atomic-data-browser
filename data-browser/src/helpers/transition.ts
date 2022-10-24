import { animationDuration } from '../styling';

export function transition(...properties: string[]): string {
  const cssStr = properties
    .map(p => `${p} ${animationDuration}ms ease-in-out`)
    .join(',');

  return cssStr;
}
