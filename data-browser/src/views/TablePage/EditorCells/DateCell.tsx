import {
  isString,
  JSONValue,
  urls,
  useResource,
  useString,
} from '@tomic/react';
import React, { useCallback } from 'react';
import { formatDate } from '../../../helpers/dates/formatDate';
import { InputBase } from './InputBase';
import { CellContainer, DisplayCellProps, EditCellProps } from './Type';

function DateCellEdit({
  value,
  onChange,
}: EditCellProps<JSONValue>): JSX.Element {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <InputBase
      type='date'
      value={value as string}
      autoFocus
      onChange={handleChange}
    />
  );
}

const toDisplayData = (value: JSONValue, format: string) => {
  if (isString(value)) {
    const valueWithTime = `${value}T00:00:00`;
    const date = new Date(valueWithTime);

    return formatDate(format, date, false);
  }
};

function DateCellDisplay({
  value,
  property,
}: DisplayCellProps<JSONValue>): JSX.Element {
  const propertyResource = useResource(property);
  const [format] = useString(
    propertyResource,
    urls.properties.constraints.dateFormat,
  );

  const displayData = toDisplayData(
    value,
    format ?? urls.instances.dateFormats.localNumeric,
  );

  return <>{displayData}</>;
}

export const DateCell: CellContainer<JSONValue> = {
  Edit: DateCellEdit,
  Display: DateCellDisplay,
};
