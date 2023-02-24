import { useStore, urls, useString } from '@tomic/react';
import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Checkbox } from '../../../components/forms/Checkbox';
import { DateFormatPicker } from './Inputs/DateFormatPicker';
import { PropertyCategoryFormProps } from './PropertyCategoryFormProps';

const valueOpts = {
  commit: false,
};

export function DatePropertyForm({
  resource,
}: PropertyCategoryFormProps): JSX.Element {
  const store = useStore();
  const [includeTime, setIncludeTime] = useState(false);
  const [dateFormat, setDateFormat] = useString(
    resource,
    urls.properties.constraints.dateFormat,
    valueOpts,
  );

  useEffect(() => {
    const type = includeTime ? urls.datatypes.timestamp : urls.datatypes.date;

    resource.set(urls.properties.datatype, type, store);
    resource.set(
      urls.properties.isA,
      [urls.classes.constraintProperties.formattedDate],
      store,
    );

    if (dateFormat === undefined) {
      resource.set(
        urls.properties.constraints.dateFormat,
        urls.instances.dateFormats.localNumeric,
        store,
      );
    }
  }, [dateFormat, store, includeTime]);

  return (
    <Suspense>
      <Label>
        <Checkbox onChange={setIncludeTime} />
        Include Time
      </Label>

      <DateFormatPicker
        value={dateFormat}
        onChange={setDateFormat}
        withTime={includeTime}
      />
    </Suspense>
  );
}

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;
