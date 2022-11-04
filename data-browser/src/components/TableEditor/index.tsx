import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { FixedSizeList, ListOnScrollProps } from 'react-window';
import Autosizer from 'react-virtualized-auto-sizer';
import { Cell, IndexCell } from './Cell';
import { TableRow } from './TableRow';
import { TableHeader, TableHeadingComponent } from './TableHeader';
import { useCellSizes } from './hooks/useCellSizes';
import {
  TableEditorContextProvider,
  useTableEditorContext,
} from './TableEditorContext';
import { useTableEditorKeyboardNavigation } from './hooks/useTableEditorKeyboardNavigation';
import { ActiveCellIndicator } from './ActiveCellIndicator';
import { ScrollArea } from '../ScrollArea';
import { useCopyCommand } from './hooks/useCopyCommand';
import { CellIndex, CopyValue } from './types';
import { useClearCommands } from './hooks/useClearCommands';

interface FancyTableProps<T> {
  columns: T[];
  itemCount: number;
  children: (props: { index: number }) => JSX.Element;
  rowHeight?: number;
  columnToKey: (column: T) => string;
  onClearRow?: (index: number) => void;
  onClearCells?: (cells: CellIndex<T>[]) => void;
  onCopyCommand?: (cells: CellIndex<T>[]) => Promise<CopyValue[][]>;

  HeadingComponent: TableHeadingComponent<T>;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

type OnScroll = (props: ListOnScrollProps) => any;

export function FancyTable<T>(props: FancyTableProps<T>): JSX.Element {
  return (
    <TableEditorContextProvider>
      <FancyTableInner {...props} />
    </TableEditorContextProvider>
  );
}

FancyTable.defaultProps = {
  rowHeight: 40,
};

function FancyTableInner<T>({
  children,
  columns,
  itemCount,
  rowHeight,
  HeadingComponent,
  columnToKey,
  onClearCells,
  onClearRow,
  onCopyCommand,
}: FancyTableProps<T>): JSX.Element {
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { listRef } = useTableEditorContext();

  const [onScroll, setOnScroll] = useState<OnScroll>(() => undefined);

  const { templateColumns, contentRowWidth, resizeCell } = useCellSizes(
    columns.length,
  );

  const triggerCopyCommand = useCopyCommand(columns, onCopyCommand);

  const handleKeyDown = useTableEditorKeyboardNavigation(
    columns.length,
    itemCount,
    tableRef,
    triggerCopyCommand,
  );

  useClearCommands(columns, onClearRow, onClearCells);

  const Row = useCallback(
    ({ index, style }: RowProps) => {
      return (
        <TableRow style={style}>
          <IndexCell rowIndex={index} columnIndex={0}>
            {index + 1}
          </IndexCell>
          {children({ index })}
          <Cell rowIndex={Infinity} columnIndex={Infinity} />
        </TableRow>
      );
    },
    [itemCount, children],
  );

  const List = useCallback(
    ({ height }) => (
      <StyledFixedSizeList
        height={height}
        width='100%'
        itemSize={rowHeight!}
        itemCount={itemCount}
        overscanCount={4}
        onScroll={onScroll}
        ref={listRef}
      >
        {Row}
      </StyledFixedSizeList>
    ),
    [rowHeight, itemCount, listRef, Row, onScroll],
  );

  return (
    <Table
      gridTemplateColumns={templateColumns}
      contentRowWidth={contentRowWidth}
      rowHeight={rowHeight!}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={tableRef}
    >
      <RelativeScrollArea ref={scrollerRef}>
        <PercentageInsanityFix>
          <TableHeader
            columns={columns}
            onResize={resizeCell}
            HeadingComponent={HeadingComponent}
            columnToKey={columnToKey}
          />
          <AutoSizeTamer>
            <Autosizer disableWidth>{List}</Autosizer>
          </AutoSizeTamer>
          <ActiveCellIndicator
            sizeStr={templateColumns}
            scrollerRef={scrollerRef}
            setOnScroll={setOnScroll}
          />
        </PercentageInsanityFix>
      </RelativeScrollArea>
    </Table>
  );
}

interface TableProps {
  gridTemplateColumns: string;
  contentRowWidth: string;
  rowHeight: number;
}

const Table = styled.div.attrs<TableProps>(p => ({
  style: {
    '--table-template-columns': p.gridTemplateColumns,
    '--table-content-width': p.contentRowWidth,
  },
}))<TableProps>`
  --table-height: 80vh;
  --table-row-height: ${p => p.rowHeight}px;
  --table-inner-padding: 0.5rem;
  background: ${p => p.theme.colors.bg};
  border-radius: ${p => p.theme.radius};
  overflow: hidden;
  overflow-x: auto;
  height: var(--table-height);
  border: 1px solid ${p => p.theme.colors.bg2};
  width: 100%;
  position: relative;
  contain: paint;
  overscroll-behavior: contain;
  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.main};
  }
`;

const PercentageInsanityFix = styled.div`
  width: fit-content;
  min-width: 100%;
`;

const StyledFixedSizeList = styled(FixedSizeList)`
  overflow-x: hidden !important;
  overflow-y: auto !important;
`;

const AutoSizeTamer = styled.div`
  height: calc(var(--table-height) - var(--table-row-height));
  width: 100%;
`;

const RelativeScrollArea = styled(ScrollArea)`
  position: relative;
`;

export { Cell } from './Cell';
export * from './types';
