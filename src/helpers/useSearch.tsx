import React from 'react';
import { Resource } from '../atomic-lib/resource';
import { useStore } from '../atomic-react/hooks';
import { QuickScore } from 'quick-score';
import { urls } from './urls';
import { Store } from '../atomic-lib/store';

/**
 * Allows for full-text search of all resources in the store. use `index.search(query)` to perform the search. Returns null or the
 * QuickScore index containing all subjects in the store. Does not index Commits or non-ready resources.
 */
export const useSearch = (): null | SearchIndex => {
  const store = useStore();
  const [index, setIndex] = React.useState<SearchIndex>(null);

  React.useEffect(() => {
    const index = constructIndex(store);
    setIndex(index);
  }, [store]);

  // Return the width so we can use it in our components
  return index;
};

/** Constructs a QuickScore search index from all resources in the store. Does not index commits or resources that are not ready */
function constructIndex(store: Store): SearchIndex {
  const resourceMap: Map<string, Resource> = store.resources;
  const subjectArray = Array.from(resourceMap.values());
  const dataArray = subjectArray.map(resource => {
    // Don't index resources that are loading / errored
    if (!resource.isReady()) return '';
    // Don't index commits
    if (resource.getClasses().includes(urls.classes.commit)) {
      return '';
    }
    // QuickScore can't handle URLs as keys, so I serialize all values of propvals to a single string. https://github.com/fwextensions/quick-score/issues/11
    const propvalsString = JSON.stringify(Array.from(resource.getPropVals().values()).sort().join(' \n '));
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

interface Hit {
  item: FoundResource;
}

interface FoundResource {
  // The subject of the found resource
  subject: string;
  // JSON serialized array of values combinations
  valuesArray: string;
}
