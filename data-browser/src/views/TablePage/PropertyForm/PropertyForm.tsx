import { Resource, urls, useString } from '@tomic/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  InputStyled,
  InputWrapper,
} from '../../../components/forms/InputStyles';
import ResourceField from '../../../components/forms/ResourceField';
import { stringToSlug } from '../../../helpers/stringToSlug';
import { dataTypeIconMap } from '../dataTypeMaps';

interface PropertyFormProps {
  resource: Resource;
}

const camelCaseToDisplayName = (camelCaseString: string) => {
  const split = camelCaseString.replace(/[A-Z]/gm, ' $&');

  return split.charAt(0).toUpperCase() + split.slice(1);
};

export function PropertyForm({ resource }: PropertyFormProps): JSX.Element {
  const [name, setName] = useString(resource, urls.properties.name);
  const [shortName, setShortName] = useString(
    resource,
    urls.properties.shortname,
  );
  const [datatype, setDatatype] = useString(resource, urls.properties.datatype);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newShortName = stringToSlug((value ?? '').trim());

      setName(value);
      setShortName(newShortName);
    },
    [setName, setShortName],
  );

  const handleDataTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDatatype(e.target.value);
    },
    [setDatatype],
  );

  const Icon = useMemo(() => dataTypeIconMap.get(datatype!), [datatype]);

  return (
    <Form>
      <div>
        <InputWrapper>
          <InputStyled type='text' value={name} onChange={handleNameChange} />
        </InputWrapper>
        {shortName}
      </div>
      <select placeholder='Datatype' onChange={handleDataTypeChange}>
        {Object.entries(urls.datatypes).map(([key, value]) => (
          <option key={value} value={value} selected={value === datatype}>
            <>
              {Icon} {camelCaseToDisplayName(key)}
            </>
          </option>
        ))}
      </select>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
