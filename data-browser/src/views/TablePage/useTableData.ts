import {
  Resource,
  urls,
  useCollection,
  UseCollectionResult,
  useResource,
  useSubject,
} from '@tomic/react';
import { useMemo } from 'react';

const PAGE_SIZE = 30;
const DEFAULT_SORT = urls.properties.commit.createdAt;

type UseTableDataResult = {
  tableClass: Resource;
} & UseCollectionResult;

export function useTableData(resource: Resource): UseTableDataResult {
  const [classSubject] = useSubject(resource, urls.properties.classType);
  const tableClass = useResource(classSubject);

  const queryFilter = useMemo(
    () => ({
      property: urls.properties.parent,
      value: resource.getSubject(),
      sort_by: DEFAULT_SORT,
    }),
    [resource.getSubject()],
  );

  return { tableClass, ...useCollection(queryFilter, PAGE_SIZE) };
}
