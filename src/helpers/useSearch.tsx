import React from 'react';
import { Resource } from '../atomic-lib/resource';
import { useStore } from '../atomic-react/hooks';
import { QuickScore } from 'quick-score';

/** Returns null or the QuickScore index containing all subjects in the store */
export const useSearch = () => {
  const store = useStore();
  const [index, setIndex] = React.useState(null);

  React.useEffect(() => {
    const resourceMap: Map<string, Resource> = store.resources;
    /** Only searches through the subjects or resources at this moment. https://github.com/fwextensions/quick-score/issues/11 */
    const subjectArray = Array.from(resourceMap.keys());
    const qs = new QuickScore(subjectArray);
    setIndex(qs);
  }, []);

  // Return the width so we can use it in our components
  return index;
};
