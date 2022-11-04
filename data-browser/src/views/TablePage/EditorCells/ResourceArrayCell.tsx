import { JSONValue } from '@tomic/react';
import React from 'react';
import { AtomicURLCell } from './AtomicURLCell';
import { CellContainer, DisplayCellProps, EditCellProps } from './Type';

function ResourceArrayCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  return (
    <input
      value={value as string}
      autoFocus
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
    />
  );
}

function ResourceArrayCellDisplay({
  value,
}: DisplayCellProps<JSONValue>): JSX.Element {
  if (!value) {
    return <></>;
  }

  return (
    <>
      {(value as string[]).map((v, i) => (
        <>
          {i !== 0 && ', '}
          <AtomicURLCell.Display value={v} key={v} />
        </>
      ))}
    </>
  );
}

export const ResourceArrayCell: CellContainer<JSONValue> = {
  Edit: ResourceArrayCellEdit,
  Display: ResourceArrayCellDisplay,
};
