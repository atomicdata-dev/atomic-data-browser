import { urls } from '@tomic/lib';
import { useEffect, useMemo, useState } from 'react';
import { useArray, useDebounce, useResource, useStore } from './index';

interface SearchResults {
  /** Subject URLs for resources that match the query */
  results: string[];
  loading: boolean;
  error?: Error;
}

interface SearchOpts {
  /**
   * Debouncing makes queries slower, but prevents sending many request. Number
   * respresents milliseconds.
   */
  debounce?: number;
  /** Fetch full resources instead of subjects */
  include?: boolean;
  /** Max of how many results to return */
  limit?: number;
  /** Subject of resource to scope the search to */
  scope?: string;
}

/** Pass a query to search the current server */
export function useServerSearch(
  query: string | undefined,
  opts: SearchOpts = {},
): SearchResults {
  const { debounce = 50, include = false, limit = 30, scope } = opts;

  const [results, setResults] = useState<string[]>([]);
  const store = useStore();
  // Calculating the query takes a while, so we debounce it
  const debouncedQuery = useDebounce(query, debounce) ?? '';

  const urlString: string = useMemo(() => {
    const url = new URL(store.getServerUrl());
    url.pathname = 'search';
    url.searchParams.set('q', debouncedQuery);
    url.searchParams.set('include', include.toString());
    url.searchParams.set('limit', limit.toString());

    if (scope) {
      url.searchParams.set('parent', scope);
    }

    return url.toString();
  }, [debouncedQuery, scope, include, limit]);

  const resource = useResource(urlString, {
    noWebSocket: true,
  });
  const [resultsIn] = useArray(resource, urls.properties.endpoint.results);

  // Only set new results if the resource is no longer loading, which improves UX
  useEffect(() => {
    if (!resource.loading && resultsIn) {
      setResults(resultsIn as string[]);
    }
  }, [
    // Prevent re-rendering if the resultsIn is the same
    resultsIn?.toString(),
    resource.loading,
  ]);

  if (!query) {
    return {
      results: [],
      loading: false,
      error: undefined,
    };
  }

  // Return the width so we can use it in our components
  return { results, loading: resource.loading, error: resource.error };
}
