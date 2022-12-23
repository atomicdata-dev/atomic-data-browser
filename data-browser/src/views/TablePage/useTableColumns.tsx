import { Resource, useStore, urls, useArray, Property } from '@tomic/react';
import { useEffect, useState } from 'react';

export function useTableColumns(tableClass: Resource): Property[] {
  const store = useStore();

  const [requiredProps] = useArray(tableClass, urls.properties.requires);
  const [recommendedProps] = useArray(tableClass, urls.properties.recommends);

  const [columns, setColumns] = useState<Property[]>([]);

  useEffect(() => {
    const props = [...requiredProps, ...recommendedProps];

    Promise.all(props.map(prop => store.getProperty(prop))).then(newColumns => {
      setColumns(newColumns);
    });
  }, [requiredProps, recommendedProps]);

  return columns;
}
