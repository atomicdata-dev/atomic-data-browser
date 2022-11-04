import {
  Resource,
  useStore,
  useSubject,
  urls,
  useResource,
  useArray,
  Property,
} from '@tomic/react';
import { useEffect, useState } from 'react';

export function useTableColumns(resource: Resource): Property[] {
  const store = useStore();
  const [classSubject] = useSubject(resource, urls.properties.classType);
  const classResource = useResource(classSubject);

  const [requiredProps] = useArray(classResource, urls.properties.requires);
  const [recommendedProps] = useArray(
    classResource,
    urls.properties.recommends,
  );

  const [columns, setColumns] = useState<Property[]>([]);

  useEffect(() => {
    const props = [...requiredProps, ...recommendedProps];

    Promise.all(props.map(prop => store.getProperty(prop))).then(newColumns => {
      setColumns(newColumns);
    });
  }, [requiredProps, recommendedProps]);

  return columns;
}
