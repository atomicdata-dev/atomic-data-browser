import {
  JSONValue,
  Property,
  Resource,
  urls,
  useStore,
  useValue,
} from '@tomic/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Cell } from '../../components/TableEditor';
import { CellAlign } from '../../components/TableEditor/Cell';
import {
  CursorMode,
  useTableEditorContext,
} from '../../components/TableEditor/TableEditorContext';
import {
  appendStringToType,
  dataTypeAlignmentMap,
  dataTypeCellMap,
} from './dataTypeMaps';
import { StringCell } from './EditorCells/StringCell';

interface TableCell {
  columnIndex: number;
  rowIndex: number;
  resource: Resource;
  property: Property;
  invalidateTable?: () => void;
}

const createdAtOpts = {
  commitDebounce: 0,
  commit: false,
};

function useIsEditing(row: number, column: number) {
  const { cursorMode, selectedColumn, selectedRow } = useTableEditorContext();

  const isEditing =
    cursorMode === CursorMode.Edit &&
    selectedColumn === column &&
    selectedRow === row;

  return isEditing;
}

const valueOpts = {
  commitDebounce: 0,
  commit: true,
};

export function TableCell({
  columnIndex,
  rowIndex,
  resource,
  property,
  invalidateTable,
}: TableCell): JSX.Element {
  const store = useStore();
  const [markForInvalidate, setMarkForInvalidate] = useState(false);
  const [value, setValue] = useValue(resource, property.subject, valueOpts);
  const [createdAt, setCreatedAt] = useValue(
    resource,
    urls.properties.commit.createdAt,
    createdAtOpts,
  );

  const dataType = property.datatype;
  const isEditing = useIsEditing(rowIndex, columnIndex);

  const Editor = useMemo(
    () => dataTypeCellMap.get(dataType) ?? StringCell,
    [dataType],
  );

  const alignment = dataTypeAlignmentMap.get(dataType) ?? CellAlign.Start;

  const onChange = useCallback(
    async (v: JSONValue) => {
      if (!createdAt) {
        await setCreatedAt(Date.now());
        await setValue(v);
        setMarkForInvalidate(true);

        return;
      }

      await setValue(v);
    },
    [setValue, setCreatedAt, createdAt],
  );

  const handleEnterEditModeWithCharacter = useCallback(
    (key: string) => {
      onChange(appendStringToType(value, key, dataType));
    },
    [onChange, value, dataType],
  );

  useEffect(() => {
    if (!isEditing && markForInvalidate) {
      resource.save(store).then(() => {
        invalidateTable?.();
        setMarkForInvalidate(false);
      });
    }
  }, [isEditing, markForInvalidate]);

  return (
    <Cell
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      align={alignment}
      onEnterEditModeWithCharacter={handleEnterEditModeWithCharacter}
    >
      {isEditing ? (
        <Editor.Edit
          value={value}
          onChange={onChange}
          property={property.subject}
          resource={resource}
        />
      ) : (
        <Editor.Display
          value={value}
          onChange={onChange}
          property={property.subject}
        />
      )}
    </Cell>
  );
}
