import { Resource, urls, useString } from '@tomic/react';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ErrorChip } from '../../../components/forms/ErrorChip';
import { useValidation } from '../../../components/forms/formValidation/useValidation';
import {
  InputStyled,
  InputWrapper,
} from '../../../components/forms/InputStyles';
import { buildComponentFactory } from '../../../helpers/buildComponentFactory';
import { stringToSlug } from '../../../helpers/stringToSlug';
import { CheckboxPropertyForm } from './CheckboxPropertyForm';
import { DatePropertyForm } from './DatePropertyForm';
import { NumberPropertyForm } from './NumberPropertyForm';
import { SelectPropertyForm } from './SelectPropertyForm';
import { TextPropertyForm } from './TextPropertyForm';

export type PropertyFormCategory =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'file'
  | 'select'
  | 'relation';

interface PropertyFormProps {
  resource: Resource;
  category?: PropertyFormCategory;
}

const NoCategorySelected = () => {
  return <span>No Type selected</span>;
};

const categoryFormFactory = buildComponentFactory(
  new Map([
    ['text', TextPropertyForm],
    ['number', NumberPropertyForm],
    ['checkbox', CheckboxPropertyForm],
    ['select', SelectPropertyForm],
    ['date', DatePropertyForm],
  ]),
  NoCategorySelected,
);

export function PropertyForm({
  resource,
  category,
}: PropertyFormProps): JSX.Element {
  const [nameError, setNameError, onNameBlur] = useValidation('Required');

  const valueOptions = useMemo(
    () => ({
      handleValidationError(e: Error | undefined) {
        if (e) {
          setNameError('Invalid Name');
        } else {
          setNameError(undefined);
        }
      },
    }),
    [],
  );

  const [name, setName] = useString(
    resource,
    urls.properties.name,
    valueOptions,
  );
  const [_, setShortName] = useString(
    resource,
    urls.properties.shortname,
    valueOptions,
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newShortName = stringToSlug((value ?? '').trim());

      setName(value);
      setShortName(newShortName);
    },
    [setName, setShortName],
  );

  const CategoryForm = categoryFormFactory(category);

  return (
    <Form>
      <div>
        <InputWrapper invalid={!!nameError}>
          <InputStyled
            type='text'
            value={name}
            onChange={handleNameChange}
            placeholder='New Column'
            onBlur={onNameBlur}
          />
        </InputWrapper>
        {nameError && <ErrorChip>{nameError}</ErrorChip>}
      </div>
      <CategoryForm resource={resource} />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
