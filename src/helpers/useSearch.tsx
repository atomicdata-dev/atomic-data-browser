import React from 'react';
import { Resource } from '../atomic-lib/resource';
import { useStore } from '../atomic-react/hooks';
import { QuickScore } from 'quick-score';

/**
 * Allows for full-text search of all resources in the store. use `index.search(query)` to perform the search. Returns null or the
 * QuickScore index containing all subjects in the store.
 */
export const useSearch = (): null | SearchIndex => {
  const store = useStore();
  const [index, setIndex] = React.useState<SearchIndex>(null);

  React.useEffect(() => {
    const resourceMap: Map<string, Resource> = store.resources;
    const subjectArray = Array.from(resourceMap.values());
    const dataArray = subjectArray.map(resource => {
      // QuickScore can't handle URLs as keys, so I serialize all propvals to a single string. https://github.com/fwextensions/quick-score/issues/11
      const propvalsString = JSON.stringify(Array.from(resource.getPropVals()));
      const searchResource: FoundResource = {
        subject: resource.getSubject(),
        propvals: propvalsString,
      };
      return searchResource;
    });
    // QuickScore requires explicit keys to search through. These should match the keys in FoundResource
    const qsOpts = { keys: ['subject', 'propvals'] };
    const qs = new QuickScore(dataArray, qsOpts);
    setIndex(qs);
  }, [store]);

  // Return the width so we can use it in our components
  return index;
};

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
  // JSON serialized string of property value combinations
  propvals: string;
}
