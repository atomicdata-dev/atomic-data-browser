import { urls, useCollection } from '@tomic/react';
import { useMemo } from 'react';

const PAGE_SIZE = 30;
const DEFAULT_SORT = urls.properties.commit.createdAt;

export function useTableData(property: string, value: string) {
  const queryFilter = useMemo(
    () => ({
      property,
      value,
      sort_by: DEFAULT_SORT,
    }),
    [property, value],
  );

  return useCollection(queryFilter, PAGE_SIZE);
}
