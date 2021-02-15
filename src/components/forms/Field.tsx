import * as React from 'react';
import { useState } from 'react';
import { useProperty } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import { FaInfo } from 'react-icons/fa';
import { ButtonIcon } from '../Button';
import AtomicLink from '../Link';
import InputSwitcher from './InputSwitcher';
import { Property } from '../../atomic-lib/store';
import { FieldStyled, InputStyled, InputWrapper, LabelHelper, LabelStyled, LabelWrapper } from './InputStyles';

/** A form field with a label */
function FieldLabeled({ property: propertyURL, resource, required }: IFieldProps): JSX.Element {
  const property = useProperty(propertyURL);
  const [collapsed, setCollapsed] = useState(true);

  if (property == null) {
    return (
      <FieldStyled>
        <LabelWrapper>
          <LabelStyled>loading...</LabelStyled>
        </LabelWrapper>
        <InputWrapper>
          <InputStyled />
        </InputWrapper>
      </FieldStyled>
    );
  }
  return (
    <FieldStyled>
      <LabelWrapper title={property.description}>
        <LabelStyled>
          {property.shortname}{' '}
          <ButtonIcon type='button' onClick={() => setCollapsed(!collapsed)}>
            <FaInfo />
          </ButtonIcon>
        </LabelStyled>
      </LabelWrapper>
      {!collapsed && (
        <LabelHelper>
          {property.description} <AtomicLink url={propertyURL}>Go to Property</AtomicLink>
        </LabelHelper>
      )}
      <InputSwitcher resource={resource} property={property} required={required} />
    </FieldStyled>
  );
}

/** A single field in a form should receive these */
export type InputProps = {
  resource: Resource;
  property: Property;
  required?: boolean;
};

interface IFieldProps {
  /** Subject of the Property */
  property: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
}

export default FieldLabeled;
