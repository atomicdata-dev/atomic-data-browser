import { Collection, CollectionBuilder, QueryFilter, Store } from '@tomic/lib';
import { useCallback, useState } from 'react';
import { useServerURL } from './useServerURL';
import { useStore } from './hooks';

export type UseCollectionResult = [
  collection: Collection,
  invalidateCollection: () => Promise<void>,
];

const buildCollection = (
  store: Store,
  server: string,
  { property, value, sort_by }: QueryFilter,
  pageSize?: number,
) => {
  const builder = new CollectionBuilder(store, server);

  property && builder.setProperty(property);
  value && builder.setValue(value);
  sort_by && builder.setSortBy(sort_by);
  pageSize && builder.setPageSize(pageSize);

  return builder.build();
};

/**
 * Creates a collection resource that is rebuild when the query filter changes or `invalidateCollection` is called.
 * @param queryFilter
 * @param pageSize number of items per collection resource, defaults to 30.
 * @returns
 */
export function useCollection(
  queryFilter: QueryFilter,
  pageSize?: number,
): UseCollectionResult {
  const store = useStore();
  const [server] = useServerURL();

  const [collection, setCollection] = useState(() =>
    buildCollection(store, server, queryFilter, pageSize),
  );

  const invalidateCollection = useCallback(async () => {
    await collection.invalidate();
    // Build a new collection so React sees it as a new object and rerenders the components using it.
    const newCollection = buildCollection(store, server, queryFilter, pageSize);

    await newCollection.waitForReady();
    setCollection(newCollection);
  }, [collection, store, server, queryFilter, pageSize]);

  return [collection, invalidateCollection];
}
