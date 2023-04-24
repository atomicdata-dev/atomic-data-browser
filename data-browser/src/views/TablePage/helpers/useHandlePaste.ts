import {
  Property,
  Resource,
  properties,
  useStore,
  Collection,
} from '@tomic/react';
import { useCallback } from 'react';
import { CellPasteData } from '../../../components/TableEditor';
import { randomSubject } from '../../../helpers/randomString';
import { appendStringToType } from '../dataTypeMaps';

export function useHandlePaste(
  table: Resource,
  collection: Collection,
  tableClass: Resource,
  invalidateCollection: () => void,
  collectionVersion: number,
) {
  const store = useStore();

  return useCallback(
    async (pasteData: CellPasteData<Property>[]) => {
      const resourceMemos = new Map<number, Resource>();
      let shouldInvalidate = false;

      for (const cell of pasteData) {
        let row = resourceMemos.get(cell.index[0]);

        if (!row) {
          let rowSubject: string | undefined;

          try {
            rowSubject = await collection.getMemberWithIndex(cell.index[0]);
          } catch (e) {
            // ignore
          }

          if (rowSubject) {
            row = await store.getResourceAsync(rowSubject);
          } else {
            shouldInvalidate = true;
            row = store.getResourceLoading(
              randomSubject(table.getSubject(), 'row'),
              {
                newResource: true,
              },
            );

            await row.set(properties.isA, [tableClass.getSubject()], store);
            await row.set(properties.commit.createdAt, Date.now(), store);
            await row.set(properties.parent, table.getSubject(), store);
          }
        }

        const property = cell.index[1];
        const value = appendStringToType(
          undefined,
          cell.data,
          property.datatype,
        );

        await row.set(property.subject, value, store);
        await row.save(store);
        resourceMemos.set(cell.index[0], row);
      }

      if (shouldInvalidate) {
        invalidateCollection();
      }
    },
    [collectionVersion, collection, invalidateCollection, store],
  );
}
