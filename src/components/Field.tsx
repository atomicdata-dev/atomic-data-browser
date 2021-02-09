import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { urls } from '../helpers/urls';
import { Datatype, datatypeFromUrl } from '../lib/datatypes';
import { useResource, useString, useTitle } from '../lib/react';
import { Resource } from '../lib/resource';
import { FaInfo } from 'react-icons/fa';
import { ButtonIcon } from './Button';

interface IFieldProps {
  /** Subject of the Property */
  property: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
}

/** A form field with a label */
function FieldLabeled({ property, resource, required }: IFieldProps): JSX.Element {
  const [propertyFull] = useResource(property);
  const label = useTitle(propertyFull);
  const [datatypeUrl] = useString(propertyFull, urls.properties.datatype);
  const datatype = datatypeFromUrl(datatypeUrl);
  const description = useString(propertyFull, urls.properties.description);
  const [collapsed, setCollapsed] = useState(true);

  if (datatype == null) {
    return <div>loading</div>;
  }

  function Input(props: InputProps) {
    switch (datatype) {
      case Datatype.STRING: {
        return <InputString resource={resource} property={property} required={required} />;
      }
      case Datatype.MARKDOWN: {
        return <InputString resource={resource} property={property} required={required} />;
      }
      case Datatype.SLUG: {
        return <InputString resource={resource} property={property} required={required} />;
      }
      case Datatype.ATOMIC_URL: {
        return <InputString resource={resource} property={property} required={required} />;
      }
      default: {
        return <p>unsupported datatype: {datatypeUrl}</p>;
      }
    }
  }
  return (
    <FieldStyled>
      <LabelWrapper>
        <LabelStyled>
          {label}{' '}
          <ButtonIcon type='button' onClick={() => setCollapsed(!collapsed)}>
            <FaInfo />
          </ButtonIcon>
        </LabelStyled>
      </LabelWrapper>
      {!collapsed && <LabelHelper>{description}</LabelHelper>}
      <Input resource={resource} property={property} />
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

export const InputStyled = styled.input`
  color: ${props => props.theme.colors.text};
  font-size: 1em;
  padding: ${props => props.theme.margin / 2}rem;
  border: none;
  --webkit-appearance: none;
  display: block;
  background-color: ${props => props.theme.colors.bg1};
  border: solid 1px ${props => props.theme.colors.bg2};
  border-radius: ${props => props.theme.radius};
  outline: none;

  &:hover {
    border-color: ${props => props.theme.colors.main};
  }

  &:focus {
    background-color: ${props => props.theme.colors.bg};
    border-color: ${props => props.theme.colors.main};
  }
`;

type InputProps = {
  resource: Resource;
  property: string;
  required?: boolean;
};

function InputString({ resource, property, required }: InputProps) {
  const [value, setVale] = useString(resource, property);
  const [err, setErr] = useState<Error>(null);

  function handleUpdate(e) {
    const newval = e.target.value;
    setVale(newval, setErr);
  }

  return (
    <div>
      <InputStyled value={value == null ? '' : value} onChange={handleUpdate} required={required} />
      {value !== '' && err && <ErrMessage>{err.message}</ErrMessage>}
      {value == '' && <ErrMessage>Required</ErrMessage>}
    </div>
  );
}

export const ErrMessage = styled.div`
  font-size: 0.8em;
  color: ${props => props.theme.colors.alert};
`;

export default FieldLabeled;
