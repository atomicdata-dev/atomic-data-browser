import { Resource, urls, useString } from '@tomic/react';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  InputStyled,
  InputWrapper,
} from '../../../components/forms/InputStyles';
import { stringToSlug } from '../../../helpers/stringToSlug';
import type { PropertyCategoryFormProps } from './PropertyCategoryFormProps';
import { TextPropertyForm } from './TextPropertyForm';

type Category =
  | 'text'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'file'
  | 'select'
  | 'relation';

interface PropertyFormProps {
  resource: Resource;
  category?: Category;
}

const categoryForms = new Map<Category, React.FC<PropertyCategoryFormProps>>();
categoryForms.set('text', TextPropertyForm);

export function PropertyForm({
  resource,
  category,
}: PropertyFormProps): JSX.Element {
  const [name, setName] = useString(resource, urls.properties.name);
  const [_, setShortName] = useString(resource, urls.properties.shortname);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newShortName = stringToSlug((value ?? '').trim());

      setName(value);
      setShortName(newShortName);
    },
    [setName, setShortName],
  );

  const CategoryForm = useMemo(() => {
    if (category && categoryForms.has(category)) {
      return categoryForms.get(category)!;
    }

    return NoCategorySelected;
  }, [category]);

  return (
    <Form>
      <InputWrapper>
        <InputStyled type='text' value={name} onChange={handleNameChange} />
      </InputWrapper>
      <CategoryForm resource={resource} />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoCategorySelected: React.FC<PropertyCategoryFormProps> = ({
  resource: _,
}) => {
  return <span>No Type selected</span>;
};
