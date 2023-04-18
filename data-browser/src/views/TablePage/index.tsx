import { Collection, Property, useStore } from '@tomic/react';
import React, { useCallback, useMemo } from 'react';
import { ContainerFull } from '../../components/Containers';
import { EditableTitle } from '../../components/EditableTitle';
import { CellIndex, CopyValue, FancyTable } from '../../components/TableEditor';
import type { ResourcePageProps } from '../ResourcePage';
import { TableHeading } from './TableHeading';
import { useTableColumns } from './useTableColumns';
import { TableNewRow, TableRow } from './TableRow';
import { useTableData } from './useTableData';
import { getValuesFromSubject } from './helpers/clipboard';
import { NewColumnButton } from './NewColumnButton';
import { TablePageContext } from './tablePageContext';
import { useHandlePaste } from './helpers/useHandlePaste';
import { useHandleColumnResize } from './helpers/useHandleColumnResize';

const columnToKey = (column: Property) => column.subject;

const transformToPropertiesPerSubject = async (
  cells: CellIndex<Property>[],
  collection: Collection,
): Promise<Record<string, Property[]>> => {
  const result: Record<string, Property[]> = {};

  for (const [rowIndex, property] of cells) {
    const subject = await collection.getMemberWithIndex(rowIndex);

    result[subject] = [...(result[subject] ?? []), property];
  }

  return result;
};

export function TablePage({ resource }: ResourcePageProps): JSX.Element {
  const store = useStore();
  const { tableClass, collection, invalidateCollection, collectionVersion } =
    useTableData(resource);

  const columns = useTableColumns(tableClass);

  const handlePaste = useHandlePaste(
    resource,
    collection,
    tableClass,
    invalidateCollection,
    collectionVersion,
  );

  const tablePageContext = useMemo(
    () => ({
      tableClassResource: tableClass,
    }),
    [tableClass],
  );

  const handleDeleteRow = useCallback(
    async (index: number) => {
      const row = await collection.getMemberWithIndex(index);

      if (!row) {
        return;
      }

      const rowResource = store.getResourceLoading(row);
      await rowResource.destroy(store);
      invalidateCollection();
    },
    [collection, store, invalidateCollection],
  );

  const handleClearCells = useCallback(
    async (cells: CellIndex<Property>[]) => {
      const resourcePropMap = await transformToPropertiesPerSubject(
        cells,
        collection,
      );

      const removePropvals = async ([subject, props]: [string, Property[]]) => {
        const res = await store.getResourceAsync(subject);

        await Promise.all(
          props.map(prop => res.set(prop.subject, undefined, store, false)),
        );

        await res.save(store);
      };

      await Promise.all(
        Array.from(Object.entries(resourcePropMap)).map(removePropvals),
      );

      invalidateCollection();
    },
    [store, collection, invalidateCollection],
  );

  const handleCopyCommand = useCallback(
    async (cells: CellIndex<Property>[]): Promise<CopyValue[][]> => {
      const propertiesPerSubject = await transformToPropertiesPerSubject(
        cells,
        collection,
      );

      const unresolvedValues = Array.from(
        Object.entries(propertiesPerSubject),
      ).map(([subject, props]) => getValuesFromSubject(subject, props, store));

      return Promise.all(unresolvedValues);
    },

    [collection, collectionVersion, store],
  );

  const [columnSizes, handleColumnResize] = useHandleColumnResize(resource);

  const Row = useCallback(
    ({ index }: { index: number }) => {
      if (index < collection.totalMembers) {
        return (
          <TableRow collection={collection} index={index} columns={columns} />
        );
      }

      return (
        <TableNewRow
          parent={resource}
          columns={columns}
          index={index}
          invalidateTable={invalidateCollection}
        />
      );
    },
    [collection, columns, collectionVersion],
  );

  if (collectionVersion === 0) {
    return <ContainerFull>Loading...</ContainerFull>;
  }

  return (
    <ContainerFull>
      <TablePageContext.Provider value={tablePageContext}>
        <EditableTitle resource={resource} />
        <FancyTable
          columns={columns}
          columnSizes={columnSizes}
          itemCount={collection.totalMembers + 1}
          columnToKey={columnToKey}
          onClearRow={handleDeleteRow}
          onCellResize={handleColumnResize}
          onClearCells={handleClearCells}
          onCopyCommand={handleCopyCommand}
          onPasteCommand={handlePaste}
          HeadingComponent={TableHeading}
          NewColumnButtonComponent={NewColumnButton}
        >
          {Row}
        </FancyTable>
      </TablePageContext.Provider>
    </ContainerFull>
  );
}
