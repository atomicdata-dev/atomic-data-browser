import { StringParam, useQueryParam } from 'use-query-params';

export function useCurrentSubject() {
  return useQueryParam('subject', StringParam);
}
