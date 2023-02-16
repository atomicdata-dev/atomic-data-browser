import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  CursorMode,
  TableEvent,
  useTableEditorContext,
} from './TableEditorContext';

export enum CellAlign {
  Start = 'flex-start',
  End = 'flex-end',
  Center = 'center',
}

export interface CellProps {
  rowIndex: number;
  columnIndex: number;
  className?: string;
  align?: CellAlign;
  onClearCell?: () => void;
  onEnterEditModeWithCharacter?: (key: string) => void;
}

export function Cell({
  rowIndex,
  columnIndex,
  className,
  children,
  align,
  onEnterEditModeWithCharacter,
}: React.PropsWithChildren<CellProps>): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const {
    selectedRow,
    selectedColumn,
    multiSelectCornerRow,
    multiSelectCornerColumn,
    cursorMode,
    setActiveCell,
    setMultiSelectCorner,
    activeCellRef,
    multiSelectCornerCellRef,
    setCursorMode,
    registerEventListener,
  } = useTableEditorContext();

  const isActive = rowIndex === selectedRow && columnIndex === selectedColumn;
  const isActiveCorner =
    rowIndex === multiSelectCornerRow &&
    columnIndex === multiSelectCornerColumn;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.shiftKey) {
        e.stopPropagation();
        setCursorMode(CursorMode.MultiSelect);
        setMultiSelectCorner(rowIndex, columnIndex);

        return;
      }

      if (isActive) {
        // @ts-ignore
        if (e.target.tagName === 'INPUT') {
          // If the user clicked on an input don't enter edit mode. (Necessary for normal checkbox behavior)
          return;
        }

        return setCursorMode(CursorMode.Edit);
      }

      setCursorMode(CursorMode.Visual);
      setActiveCell(rowIndex, columnIndex);
    },
    [setActiveCell, isActive],
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    if (isActiveCorner) {
      multiSelectCornerCellRef.current = ref.current;
    }
  }, [isActiveCorner]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (isActive) {
      ref.current.focus();
      activeCellRef.current = ref.current;

      const unregister = registerEventListener(
        TableEvent.EnterEditModeWithCharacter,
        onEnterEditModeWithCharacter ?? (() => undefined),
      );

      return () => {
        unregister();
      };
    }
  }, [isActive, onEnterEditModeWithCharacter]);

  return (
    <CellWrapper
      ref={ref}
      className={className}
      onClick={handleClick}
      allowUserSelect={cursorMode === CursorMode.Edit}
      align={align}
    >
      {children}
    </CellWrapper>
  );
}

export const IndexCell = styled(Cell)`
  justify-content: flex-end !important;
  color: ${p => p.theme.colors.textLight};
`;

export interface CellWrapperProps {
  align?: CellAlign;
  allowUserSelect?: boolean;
}

export const CellWrapper = styled.div<CellWrapperProps>`
  background: ${p => p.theme.colors.bg};
  display: flex;
  width: 100%;
  justify-content: ${p => p.align ?? 'flex-start'};
  align-items: center;
  user-select: ${p => (p.allowUserSelect ? 'text' : 'none')};
  padding-inline: var(--table-inner-padding);
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
`;
