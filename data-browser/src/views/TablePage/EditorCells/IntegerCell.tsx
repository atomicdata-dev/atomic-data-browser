import { JSONValue } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { InputBase } from './InputBase';
import { CellContainer, DisplayCellProps, EditCellProps } from './Type';

function IntegerCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  return (
    <InputBase
      value={value as number}
      type='number'
      autoFocus
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number.parseInt(e.target.value);

        if (Number.isNaN(num)) {
          return onChange(undefined);
        }

        return onChange(num);
      }}
    />
  );
}

function IntegerCellDisplay({
  value,
}: DisplayCellProps<JSONValue>): JSX.Element {
  return <Aligned>{value as number}</Aligned>;
}

export const IntegerCell: CellContainer<JSONValue> = {
  Edit: IntegerCellEdit,
  Display: IntegerCellDisplay,
};

const Aligned = styled.span`
  text-align: end;
  display: inline-block;
  width: 100%;
`;
