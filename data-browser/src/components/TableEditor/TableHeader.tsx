import React from 'react';
import styled from 'styled-components';
import { TableHeading, TableHeadingWrapper } from './TableHeading';
import { TableRow } from './TableRow';

export type TableHeadingComponent<T> = ({
  column,
}: {
  column: T;
}) => JSX.Element;

export interface TableHeaderProps<T> {
  columns: T[];
  onResize: (index: number, size: string) => void;
  columnToKey: (column: T) => string;
  HeadingComponent: TableHeadingComponent<T>;
  NewColumnButtonComponent: React.ComponentType;
}

export function TableHeader<T>({
  columns,
  onResize,
  columnToKey,
  HeadingComponent,
  NewColumnButtonComponent,
}: TableHeaderProps<T>): JSX.Element {
  return (
    <StyledTableRow>
      <TableHeadingWrapper align='end'>#</TableHeadingWrapper>
      {columns.map((column, index) => (
        <TableHeading
          key={columnToKey(column)}
          index={index}
          onResize={onResize}
        >
          <HeadingComponent column={column} />
        </TableHeading>
      ))}
      <TableHeadingWrapper>
        <NewColumnButtonComponent />
      </TableHeadingWrapper>
    </StyledTableRow>
  );
}

const StyledTableRow = styled(TableRow)`
  z-index: 10;
  position: relative;
`;
