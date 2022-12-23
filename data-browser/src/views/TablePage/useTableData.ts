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

export function useTableData(
  resource: Resource,
): [Resource, ...UseCollectionResult] {
  const [classSubject] = useSubject(resource, urls.properties.classType);
  const classResource = useResource(classSubject);

  const queryFilter = useMemo(
    () => ({
      property: urls.properties.parent,
      value: resource.getSubject(),
      sort_by: DEFAULT_SORT,
    }),
    [resource.getSubject()],
  );

  return [classResource, ...useCollection(queryFilter, PAGE_SIZE)];
}
