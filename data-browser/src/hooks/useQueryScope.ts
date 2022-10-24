import { useCallback } from 'react';
import { useQueryString } from '../helpers/navigation';

export interface QueryScopeHandler {
  scope: string | undefined;
  enableScope: () => void;
  clearScope: () => void;
}

export function useQueryScopeHandler(subject: string): QueryScopeHandler;
export function useQueryScopeHandler(): Omit<QueryScopeHandler, 'enableScope'>;
export function useQueryScopeHandler(subject?: string): QueryScopeHandler {
  const [scope, setScope] = useQueryString('queryscope');

  const enableScope = useCallback(() => {
    setScope(subject);
    // setQuery('');
  }, [setScope, subject]);

  const clearScope = useCallback(() => {
    setScope(undefined);
  }, [setScope]);

  return {
    scope,
    enableScope,
    clearScope,
  };
}
