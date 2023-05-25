import React, { useCallback } from 'react';
import styled from 'styled-components';
import {
  TableHeading,
  TableHeadingDummy,
  TableHeadingWrapper,
} from './TableHeading';
import { TableRow } from './TableRow';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  Modifier,
  closestCorners,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { useDragSensors } from './useDragSensors';
import { ColumnReorderHandler } from './types';
import { ReorderDropArea } from './ReorderDropArea';

export type TableHeadingComponent<T> = ({
  column,
}: {
  column: T;
}) => JSX.Element;

export interface TableHeaderProps<T> {
  columns: T[];
  onResize: (index: number, size: string) => void;
  columnToKey: (column: T) => string;
  onColumnReorder?: ColumnReorderHandler;
  HeadingComponent: TableHeadingComponent<T>;
  NewColumnButtonComponent: React.ComponentType;
  headerRef: React.Ref<HTMLDivElement>;
}

const restrictToHorizontalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: 0,
  };
};

export function TableHeader<T>({
  columns,
  onResize,
  columnToKey,
  onColumnReorder,
  HeadingComponent,
  NewColumnButtonComponent,
  headerRef,
}: TableHeaderProps<T>): JSX.Element {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

  const sensors = useDragSensors();

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const key = columns.map(columnToKey).indexOf(event.active.id as string);
      setActiveIndex(key);

      document.body.style.cursor = 'grabbing';
    },
    [columns, columnToKey],
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveIndex(undefined);
      document.body.style.cursor = 'unset';

      if (over) {
        const draggableIndex = active.data.current!.index as number;
        let droppapleIndex = over.data.current!.index as number;

        if (droppapleIndex > draggableIndex) {
          droppapleIndex -= 1;
        }

        onColumnReorder?.(draggableIndex, droppapleIndex);
      }
    },
    [onColumnReorder],
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToHorizontalAxis]}
    >
      <StyledTableRow ref={headerRef}>
        <TableHeadingWrapper align='end'>#</TableHeadingWrapper>
        {columns.map((column, index) => (
          <TableHeading
            key={columnToKey(column)}
            dragKey={columnToKey(column)}
            index={index}
            onResize={onResize}
            isReordering={activeIndex !== undefined}
          >
            <HeadingComponent column={column} />
          </TableHeading>
        ))}
        <TableHeadingWrapper>
          <ReorderDropArea index={columns.length} />
          <NewColumnButtonComponent />
        </TableHeadingWrapper>
      </StyledTableRow>
      {createPortal(
        <StyledDragOverlay>
          {activeIndex !== undefined && (
            <TableHeadingDummy>
              <HeadingComponent column={columns[activeIndex]} />
            </TableHeadingDummy>
          )}
        </StyledDragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}

const StyledTableRow = styled(TableRow)`
  z-index: 10;
  position: relative;
`;

const StyledDragOverlay = styled(DragOverlay)`
  box-shadow: ${p => p.theme.boxShadowSoft};
  background-color: ${p => p.theme.colors.bg1};
  display: flex;
  align-items: center;
  border-radius: ${p => p.theme.radius};
  padding-inline: ${p => p.theme.margin}rem;
  opacity: 0.88;
`;
