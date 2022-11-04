import React from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import { IconButton } from '../IconButton/IconButton';
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
  HeadingComponent: TableHeadingComponent<T>;
  columnToKey: (column: T) => string;
}

export function TableHeader<T>({
  columns,
  onResize,
  HeadingComponent,
  columnToKey,
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
        <IconButton title='Add column'>
          <FaPlus />
        </IconButton>
      </TableHeadingWrapper>
    </StyledTableRow>
  );
}

const StyledTableRow = styled(TableRow)`
  z-index: 10;
  position: relative;
`;
