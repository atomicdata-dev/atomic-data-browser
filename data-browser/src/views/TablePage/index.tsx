import { Collection, Property, urls, useStore } from '@tomic/react';
import React, { useCallback, useEffect, useState } from 'react';
import { ContainerFull } from '../../components/Containers';
import { EditableTitle } from '../../components/EditableTitle';
import { CellIndex, CopyValue, FancyTable } from '../../components/TableEditor';
import type { ResourcePageProps } from '../ResourcePage';
import { TableHeading } from './TableHeading';
import { useTableColumns } from './useTableColumns';
import { TableNewRow, TableRow } from './TableRow';
import { useTableData } from './useTableData';
import { getValuesFromSubject } from './helpers/clipboard';
import { NewPropertyDialog } from './PropertyForm/NewPropertyDialog';

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
  const [showNewPropertyDialog, setShowNewPropertyDialog] = useState(false);

  const [tableClass, collection, invalidateTable] = useTableData(resource);

  const columns = useTableColumns(tableClass);

  useEffect(() => {
    console.log('Table mount');
  }, []);

  const handleDeleteRow = useCallback(
    async (index: number) => {
      const row = await collection.getMemberWithIndex(index);

      if (!row) {
        return;
      }

      const rowResource = store.getResourceLoading(row);
      await rowResource.destroy(store);
      invalidateTable();
    },
    [collection, store, invalidateTable],
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

      invalidateTable();
    },
    [store, collection, invalidateTable],
  );

  const handleNewColumnClick = useCallback(() => {
    setShowNewPropertyDialog(true);
  }, []);

  const handleCopyCommand = useCallback(
    async (cells: CellIndex<Property>[]): Promise<CopyValue[][]> => {
      const propertiesPerSubject = await transformToPropertiesPerSubject(
        cells,
        collection,
      );

      const unresolvedValues = Array.from(
        Object.entries(propertiesPerSubject),
      ).map(([subject, properties]) =>
        getValuesFromSubject(subject, properties, store),
      );

      return Promise.all(unresolvedValues);
    },

    [collection, store],
  );

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
          invalidateTable={invalidateTable}
        />
      );
    },
    [collection, columns],
  );

  return (
    <ContainerFull>
      <EditableTitle resource={resource} />
      <FancyTable
        columns={columns}
        itemCount={collection.totalMembers + 1}
        HeadingComponent={TableHeading}
        columnToKey={columnToKey}
        onClearRow={handleDeleteRow}
        onClearCells={handleClearCells}
        onCopyCommand={handleCopyCommand}
        onNewColumnClick={handleNewColumnClick}
      >
        {Row}
      </FancyTable>
      <NewPropertyDialog
        showDialog={showNewPropertyDialog}
        tableClassResource={tableClass}
        bindShow={setShowNewPropertyDialog}
      />
    </ContainerFull>
  );
}
