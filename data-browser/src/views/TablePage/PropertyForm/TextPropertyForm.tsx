import { Datatype, urls, useStore } from '@tomic/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Column } from '../../../components/Row';
import { FormGroupHeading } from './FormGroupHeading';
import { PropertyCategoryFormProps } from './PropertyCategoryFormProps';
import { RangeInput } from './RangeInput';

export const TextPropertyForm: React.FC<PropertyCategoryFormProps> = ({
  resource,
}) => {
  const store = useStore();
  const [textFormat, setTextFormat] = useState<Datatype>(Datatype.STRING);

  const handleTextFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextFormat(e.target.value as Datatype);

    resource.set(urls.properties.datatype, e.target.value, store, false);
  };

  return (
    <Column>
      <FormGroupHeading>Text Format:</FormGroupHeading>
      <div>
        <RadioWrapper>
          <input
            type='radio'
            name='text-format'
            id='text-format-plain'
            value={Datatype.STRING}
            checked={textFormat === Datatype.STRING}
            onChange={handleTextFormatChange}
          />
          <label htmlFor='text-format-plain'>Plain text</label>
        </RadioWrapper>
        <RadioWrapper>
          <input
            type='radio'
            name='text-format'
            id='text-format-rich'
            value={Datatype.MARKDOWN}
            checked={textFormat === Datatype.MARKDOWN}
            onChange={handleTextFormatChange}
          />
          <label htmlFor='text-format-rich'>Rich text</label>
        </RadioWrapper>
        <RadioWrapper>
          <input
            type='radio'
            name='text-format'
            id='text-format-slug'
            value={Datatype.SLUG}
            checked={textFormat === Datatype.SLUG}
            onChange={handleTextFormatChange}
          />
          <label htmlFor='text-format-slug'>Slug</label>
        </RadioWrapper>
      </div>
      <FormGroupHeading>Length</FormGroupHeading>
      <RangeInput defaultRange={[0, 0]} label='Limit length' />
    </Column>
  );
};

const RadioWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
