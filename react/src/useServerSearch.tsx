import { urls } from '@tomic/lib';
import { useEffect, useState } from 'react';
import { useArray, useDebounce, useResource, useStore } from './index.js';

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
}

/** Pass a query to search the current server */
export function useServerSearch(
  query: string | null,
  opts: SearchOpts = {},
): SearchResults {
  const { debounce = 50, include = false, limit = 30 } = opts;
  const [results, setResults] = useState([]);
  const store = useStore();
  // Calculating the query takes a while, so we debounce it
  const debouncedQuery = useDebounce(query, debounce);

  function createURLString(): string {
    const url = new URL(store.getServerUrl());
    url.pathname = 'search';
    url.searchParams.set('q', debouncedQuery);
    url.searchParams.set('include', include.toString());
    url.searchParams.set('limit', limit.toString());
    return url.toString();
  }

  const resource = useResource(createURLString());
  const [resultsIn] = useArray(resource, urls.properties.endpoint.results);

  // Only set new results if the resource is no longer loading, which improves UX
  useEffect(() => {
    if (!resource.loading && resultsIn) {
      setResults(resultsIn);
    }
  }, [
    // Prevent re-rendering if the resultsIn is the same
    resultsIn.toString(),
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
