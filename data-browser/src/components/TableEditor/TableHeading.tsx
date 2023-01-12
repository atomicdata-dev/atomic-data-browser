import React, { useEffect } from 'react';
import styled from 'styled-components';
import { DragAreaBase, useResizable } from '../../hooks/useResizable';
import { useTableEditorContext } from './TableEditorContext';

interface TableHeadingProps {
  index: number;
  onResize: (index: number, size: string) => void;
}

export function TableHeading({
  children,
  index,
  onResize,
}: React.PropsWithChildren<TableHeadingProps>): JSX.Element {
  const { size, targetRef, dragAreaRef, isDragging } =
    useResizable<HTMLDivElement>(200, 100);
  const { setIsDragging } = useTableEditorContext();

  useEffect(() => {
    setIsDragging(isDragging);
  }, [isDragging]);

  useEffect(() => {
    onResize(index, size);
  }, [size]);

  return (
    <TableHeadingWrapper ref={targetRef}>
      {children}
      <ResizeHandle isDragging={isDragging} ref={dragAreaRef} />
    </TableHeadingWrapper>
  );
}

export interface TableHeadingWrapperProps {
  align?: 'start' | 'end';
}

export const TableHeadingWrapper = styled.div<TableHeadingWrapperProps>`
  position: relative;
  background-color: ${p => p.theme.colors.bg1};
  display: flex;
  align-items: center;
  justify-content: ${p => p.align ?? 'start'};
  padding-inline: var(--table-inner-padding);
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
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
