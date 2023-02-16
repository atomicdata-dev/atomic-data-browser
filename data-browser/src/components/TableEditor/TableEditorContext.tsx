import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { EventManager } from '../../helpers/EventManager';

export enum TableEvent {
  EnterEditModeWithCharacter = 'enterEditModeWithCharacter',
  ClearCell = 'clearCell',
  ClearRow = 'clearRow',
}

export type TableEventHandlers = {
  enterEditModeWithCharacter: (key: string) => void;
  clearCell: () => void;
  clearRow: (index: number) => void;
};

export enum CursorMode {
  Visual,
  Edit,
  MultiSelect,
}

export interface TableEditorContext {
  selectedRow: number | undefined;
  selectedColumn: number | undefined;
  multiSelectCornerRow: number | undefined;
  multiSelectCornerColumn: number | undefined;
  setActiveCell: (row: number | undefined, column: number | undefined) => void;
  indicatorHidden: boolean;
  setIndicatorHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setMultiSelectCorner: (
    row: number | undefined,
    column: number | undefined,
  ) => void;
  activeCellRef: React.MutableRefObject<HTMLDivElement | null>;
  multiSelectCornerCellRef: React.MutableRefObject<HTMLDivElement | null>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  listRef: React.MutableRefObject<FixedSizeList | null>;
  cursorMode: CursorMode;
  setCursorMode: React.Dispatch<React.SetStateAction<CursorMode>>;
  clearCell: () => void;
  clearRow: (index: number) => void;
  enterEditModeWithCharacter: (key: string) => void;
  registerEventListener<T extends TableEvent>(
    event: T,
    cb: TableEventHandlers[T],
  );
}

const initial = {
  selectedRow: undefined,
  selectedColumn: undefined,
  multiSelectCornerRow: undefined,
  multiSelectCornerColumn: undefined,
  setActiveCell: () => undefined,
  indicatorHidden: false,
  setIndicatorHidden: (_: boolean | ((__: boolean) => boolean)) => false,
  setMultiSelectCorner: () => undefined,
  activeCellRef: { current: null },
  multiSelectCornerCellRef: { current: null },
  isDragging: false,
  setIsDragging: (_: boolean | ((__: boolean) => boolean)) => false,
  listRef: { current: null },
  cursorMode: CursorMode.Visual,
  setCursorMode: (_: CursorMode | ((__: CursorMode) => CursorMode)) => 0,
  clearCell: () => undefined,
  clearRow: (_: number) => undefined,
  enterEditModeWithCharacter: (_: string) => undefined,
  registerEventListener: () => undefined,
};

const TableEditorContext = React.createContext<TableEditorContext>(initial);

export function TableEditorContextProvider({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
  const listRef = useRef<FixedSizeList>(null);
  const [eventManager] = useState(
    () => new EventManager<TableEvent, TableEventHandlers>(),
  );
  const [selectedRow, setSelectedRow] = useState<number | undefined>();
  const [selectedColumn, setSelectedColumn] = useState<number | undefined>();
  const [multiSelectCornerRow, setMultiSelectCornerRow] = useState<
    number | undefined
  >();
  const [multiSelectCornerColumn, setMultiSelectCornerColumn] = useState<
    number | undefined
  >();

  const [isDragging, setIsDragging] = useState(false);
  const [cursorMode, setCursorMode] = useState(CursorMode.Visual);

  const [indicatorHidden, setIndicatorHidden] = useState(false);

  const activeCellRef = useRef<HTMLDivElement | null>(null);
  const multiSelectCornerCellRef = useRef<HTMLDivElement | null>(null);

  const setActiveCell = useCallback(
    (row: number | undefined, column: number | undefined) => {
      setSelectedRow(row);
      setSelectedColumn(column);
    },
    [],
  );

  const setMultiSelectCorner = useCallback(
    (row: number | undefined, column: number | undefined) => {
      setMultiSelectCornerRow(row);
      setMultiSelectCornerColumn(column);
    },
    [],
  );

  const clearCell = useCallback(() => {
    eventManager.emit(TableEvent.ClearCell);
  }, [eventManager]);

  const clearRow = useCallback(
    (index: number) => {
      eventManager.emit(TableEvent.ClearRow, index);
    },
    [eventManager],
  );

  const enterEditModeWithCharacter = useCallback(
    (key: string) => {
      eventManager.emit(TableEvent.EnterEditModeWithCharacter, key);
    },
    [eventManager],
  );

  const context = useMemo(
    () => ({
      selectedRow,
      selectedColumn,
      multiSelectCornerRow,
      multiSelectCornerColumn,
      indicatorHidden,
      setIndicatorHidden,
      setActiveCell,
      setMultiSelectCorner,
      activeCellRef,
      multiSelectCornerCellRef,
      isDragging,
      setIsDragging,
      listRef,
      cursorMode,
      setCursorMode,
      registerEventListener: eventManager.register.bind(eventManager),
      clearCell,
      clearRow,
      enterEditModeWithCharacter,
    }),
    [
      selectedRow,
      selectedColumn,
      multiSelectCornerColumn,
      multiSelectCornerRow,
      indicatorHidden,
      setActiveCell,
      setMultiSelectCorner,
      isDragging,
      cursorMode,
    ],
  );

  return (
    <TableEditorContext.Provider value={context}>
      {children}
    </TableEditorContext.Provider>
  );
}

export function useTableEditorContext() {
  return React.useContext(TableEditorContext);
}
