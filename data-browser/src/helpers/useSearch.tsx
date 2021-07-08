import React from 'react';
import { isValidURL, Resource, urls } from '@tomic/lib';
import { useResources, useStore } from '@tomic/react';
import { QuickScore } from 'quick-score';
import { useDebounce } from './useDebounce';

/**
 * Pass a query and an set of pre-defined subjects. If you don't pass these
 * subjects, it will search all subjects. Use the 'disabled' argument to disable
 * this very expensive hook as much as possible
 */
export function useSearch(
  query: string,
  subjects?: string[],
  disabled?: boolean,
): Hit[] {
  const [index, setIndex] = React.useState<SearchIndex>(null);
  const [results, setResults] = React.useState<Hit[]>([]);
  const store = useStore();
  let resources = useResources(subjects || []);
  const debouncedQuery = useDebounce(query, 40);

  if (subjects == undefined) {
    resources = store.resources;
  }

  React.useEffect(() => {
    if (disabled) {
      return;
    }
    setIndex(constructIndex(resources));
  }, [resources, disabled]);

  React.useEffect(() => {
    if (disabled) {
      return;
    }
    if (index == null) {
      return;
    }
    // For some reason, searching for a URL as query takes infinitely long..?
    if (isValidURL(debouncedQuery)) {
      return;
    }

    const searchResults = index && index.search(debouncedQuery);
    setResults(searchResults);
  }, [debouncedQuery, index, disabled]);

  // Return the width so we can use it in our components
  return results;
}

/**
 * Constructs a QuickScore search index from all resources in the store. Does
 * not index commits or resources that are not ready
 */
function constructIndex(resourceMap?: Map<string, Resource>): SearchIndex {
  const resources = Array.from(resourceMap.values());
  const dataArray = resources.map(resource => {
    // Don't index resources that are loading / errored
    if (!resource.isReady()) return '';
    // ... or have no subject
    if (resource.getSubject() == undefined) {
      return '';
    }
    // Don't index commits
    if (resource.getClasses().includes(urls.classes.commit)) {
      return '';
    }
    // QuickScore can't handle URLs as keys, so I serialize all values of propvals to a single string. https://github.com/fwextensions/quick-score/issues/11
    const propvalsString = JSON.stringify(
      Array.from(resource.getPropVals().values()).sort().join(' \n '),
    );
    const searchResource: FoundResource = {
      subject: resource.getSubject(),
      valuesArray: propvalsString,
    };
    return searchResource;
  });
  // QuickScore requires explicit keys to search through. These should match the keys in FoundResource
  const qsOpts = { keys: ['subject', 'valuesArray'] };
  const qs = new QuickScore(dataArray, qsOpts);
  return qs;
}

/** An instance of QuickScore. See https://fwextensions.github.io/quick-score/ */
interface SearchIndex {
  search: (query: string) => Hit[];
}

export interface Hit {
  item: FoundResource;
}

interface FoundResource {
  // The subject of the found resource
  subject: string;
  // JSON serialized array of values combinations
  valuesArray: string;
}
