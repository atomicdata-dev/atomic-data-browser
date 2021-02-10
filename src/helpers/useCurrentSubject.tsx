import { StringParam, useQueryParam } from 'use-query-params';

export function useCurrentSubject(): [
  string,
  (newValue: string | ((latestValue: string) => string), updateType?: 'replace' | 'push' | 'replaceIn' | 'pushIn') => void,
] {
  return useQueryParam('subject', StringParam);
}
