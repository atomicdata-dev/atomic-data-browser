import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { DragAreaBase, useResizable } from '../../hooks/useResizable';
import { useTableEditorContext } from './TableEditorContext';
import { useDraggable } from '@dnd-kit/core';
import { ReorderDropArea } from './ReorderDropArea';
import { transparentize } from 'polished';

interface TableHeadingProps {
  index: number;
  dragKey: string;
  onResize: (index: number, size: string) => void;
  isReordering: boolean;
}

export function TableHeading({
  children,
  dragKey,
  index,
  isReordering,
  onResize,
}: React.PropsWithChildren<TableHeadingProps>): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isReorderingThisNode,
  } = useDraggable({
    id: dragKey,
    data: { index },
  });

  const { size, targetRef, dragAreaRef, isDragging } =
    useResizable<HTMLDivElement>(200, 100);

  const { setIsDragging } = useTableEditorContext();

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging]);

  useEffect(() => {
    onResize(index, size);
  }, [size]);

  const setRef = useCallback((node: HTMLDivElement) => {
    setNodeRef(node);
    // @ts-ignore
    targetRef.current = node;
  }, []);

  return (
    <TableHeadingWrapper ref={setRef} reordering={isReorderingThisNode}>
      <ReorderHandle {...listeners} {...attributes} title='Reorder column' />
      {isReordering && <ReorderDropArea index={index} />}
      {children}
      <ResizeHandle isDragging={isDragging} ref={dragAreaRef} />
    </TableHeadingWrapper>
  );
}

export function TableHeadingDummy({ children }: React.PropsWithChildren) {
  return <TableHeadingWrapperDummy>{children}</TableHeadingWrapperDummy>;
}

export interface TableHeadingWrapperProps {
  align?: 'start' | 'end';
  reordering?: boolean;
}

export const TableHeadingWrapper = styled.div<TableHeadingWrapperProps>`
  position: relative;
  background-color: ${p =>
    p.reordering
      ? transparentize(0.5, p.theme.colors.bg1)
      : p.theme.colors.bg1};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${p => p.align ?? 'start'};
  padding-inline: var(--table-inner-padding);
  font-weight: bold;
  white-space: nowrap;
  isolation: isolate;
  color: ${p =>
    p.reordering
      ? transparentize(0.5, p.theme.colors.textLight)
      : p.theme.colors.textLight};
`;

const TableHeadingWrapperDummy = styled(TableHeadingWrapper)`
  cursor: grabbing;
`;

const ResizeHandle = styled(DragAreaBase)`
  --handle-margin: 4px;
  right: -2px;
  top: 0;
  height: calc(var(--table-row-height) - (var(--handle-margin) * 2));
  width: 4px;
  margin-top: var(--handle-margin);
  z-index: 10;
  position: absolute;
`;

const ReorderHandle = styled.button`
  border: none;
  background: none;
  position: absolute;
  inset: 0;
  cursor: grab;
  z-index: -1;
`;
