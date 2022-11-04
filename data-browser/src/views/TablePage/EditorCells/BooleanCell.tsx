import { JSONValue } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { CellContainer, DisplayCellProps, EditCellProps } from './Type';

function BooleanCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  return (
    <InputCheckBox
      type='checkbox'
      autoFocus
      checked={value as boolean}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.checked)
      }
    />
  );
}

function BooleanCellDisplay({
  value,
  onChange,
}: DisplayCellProps<JSONValue>): JSX.Element {
  return (
    <InputCheckBox
      type='checkbox'
      checked={value as boolean}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.checked)
      }
    />
  );
}

export const BooleanCell: CellContainer<JSONValue> = {
  Edit: BooleanCellEdit,
  Display: BooleanCellDisplay,
};

const InputCheckBox = styled.input`
  --inset: 1px;
  --size: calc(100% - (var(--inset) * 2));

  background-color: ${p => p.theme.colors.bg1};
  appearance: none;
  border: 1px solid ${p => p.theme.colors.bg2};
  width: 1rem;
  height: 1rem;
  border-radius: 3px;

  position: relative;

  :checked {
    border: none;
  }

  :checked::before {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    background-color: ${p => p.theme.colors.main};
  }

  :checked::after {
    --inset: 3px;
    --size: calc(100% - (var(--inset) * 2));
    content: '';
    position: absolute;
    inset: var(--inset);
    width: var(--size);
    height: var(--size);
    background-color: ${p => p.theme.colors.bg};
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }
`;
