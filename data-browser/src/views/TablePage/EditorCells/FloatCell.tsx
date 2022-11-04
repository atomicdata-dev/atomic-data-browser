import { JSONValue } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { InputBase } from './InputBase';
import { CellContainer, DisplayCellProps, EditCellProps } from './Type';

function FloatCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  return (
    <InputBase
      value={value as number}
      type='number'
      autoFocus
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number.parseFloat(e.target.value);

        if (Number.isNaN(num)) {
          return onChange(undefined);
        }

        return onChange(num);
      }}
    />
  );
}

function FloatCellDisplay({ value }: DisplayCellProps<JSONValue>): JSX.Element {
  return <Aligned>{value as number}</Aligned>;
}

export const FloatCell: CellContainer<JSONValue> = {
  Edit: FloatCellEdit,
  Display: FloatCellDisplay,
};

const Aligned = styled.span`
  text-align: end;
  display: inline-block;
  width: 100%;
`;
