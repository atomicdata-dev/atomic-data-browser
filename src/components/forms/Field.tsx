import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useProperty } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import { FaInfo } from 'react-icons/fa';
import { ButtonIcon } from '../Button';
import Link from '../Link';
import InputSwitcher from './FieldSwitcher';
import { Property } from '../../atomic-lib/store';

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
          {property.description} <Link url={propertyURL}>Go to Property</Link>
        </LabelHelper>
      )}
      <InputSwitcher resource={resource} property={property} required={required} />
    </FieldStyled>
  );
}

const FieldStyled = styled.div`
  margin-bottom: ${props => props.theme.margin}rem;
`;

const LabelWrapper = styled.div`
  display: flex;
`;

export const LabelStyled = styled.label`
  font-weight: bold;
  display: block;
`;

const LabelHelper = styled.label`
  font-size: 0.9em;
`;

/** A wrapper for inputs, for example when you want to add a button to some field */
export const InputWrapper = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.bg1};
  border: solid 1px ${props => props.theme.colors.bg2};
  border-radius: ${props => props.theme.radius};
  overflow: hidden;
`;

export const InputStyled = styled.input`
  flex: 1;
  color: ${props => props.theme.colors.text};
  font-size: 1em;
  padding: ${props => props.theme.margin / 2}rem;
  border: none;
  --webkit-appearance: none;
  display: block;
  background-color: ${props => props.theme.colors.bg1};
  /* Invisible border, but useful because you need to set :focus styles with Input tags */
  border: solid 1px ${props => props.theme.colors.bg1};
  /* border-radius: ${props => props.theme.radius}; */
  outline: none;
  box-sizing: border-box;
  /* If buttons are inside the input, the edges should be sharp */
  border-top-left-radius: ${props => props.theme.radius};
  border-bottom-left-radius: ${props => props.theme.radius};

  &:hover {
    border-color: ${props => props.theme.colors.main};
  }

  &:focus {
    border: solid 1px ${props => props.theme.colors.main};
    background-color: ${props => props.theme.colors.bg};
  }

  &:last-child {
    border-radius: ${props => props.theme.radius};
  }
`;

/** A single field in a form should receive these */
export type InputProps = {
  resource: Resource;
  property: Property;
  required?: boolean;
};

export const ErrMessage = styled.div`
  font-size: 0.8em;
  color: ${props => props.theme.colors.alert};
`;

interface IFieldProps {
  /** Subject of the Property */
  property: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
}

export default FieldLabeled;
