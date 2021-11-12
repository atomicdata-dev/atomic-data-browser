import { useStore, useResource } from '@tomic/react';
import { urls } from '@tomic/lib';
import { useDebounce } from './useDebounce';
import { useArray } from '@tomic/react';
import { useEffect, useState } from 'react';

interface SearchResults {
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
  query: string,
  opts: SearchOpts = {},
): SearchResults {
  const { debounce = 50, include = false, limit = 30 } = opts;
  const [results, setResults] = useState([]);
  const store = useStore();

  const url = new URL(store.getBaseUrl());
  // Calculate the query takes a while, so we debounce it
  const debouncedQuery = useDebounce(query, debounce);
  url.pathname = 'search';
  url.searchParams.set('q', debouncedQuery);
  url.searchParams.set('include', include.toString());
  url.searchParams.set('limit', limit.toString());
  console.log('searchparams', url.toString());
  const [resource] = useResource(url.toString());
  const [resultsIn] = useArray(resource, urls.properties.endpoint.results);

  // Only set new results if the resource is no longer loading, which improves UX
  useEffect(() => {
    if (!resource.loading && resultsIn) {
      setResults(resultsIn);
    }
  }, [resultsIn, resource.loading]);

  // Return the width so we can use it in our components
  return { results, loading: resource.loading };
}
