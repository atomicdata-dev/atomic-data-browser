import * as React from 'react';
import { useProperty } from '@tomic/react';
import { Resource, Property } from '@tomic/lib';
import styled from 'styled-components';
import Field from './Field';
import Markdown from '../datatypes/Markdown';
import { InputWrapper, InputStyled } from './InputStyles';
import InputSwitcher from './InputSwitcher';
import AtomicLink from '../Link';
import { useState } from 'react';
import { Button } from '../Button';

/** An input field for a single Property, rendered with a Label. Has a loading state. */
function ResourceField({
  handleDelete,
  propertyURL,
  resource,
  required,
  autoFocus,
  disabled,
}: IFieldProps): JSX.Element {
  const property = useProperty(propertyURL);
  const [collapsedDynamic, setCollapsedDynamic] = useState(true);

  if (property === null) {
    return (
      <Field label='loading...'>
        <InputWrapper>
          <InputStyled disabled={disabled} placeholder='loading property...' />
        </InputWrapper>
      </Field>
    );
  }

  if (property.isDynamic && collapsedDynamic) {
    return (
      <Field
        helper={
          <HelperText text={property.description} link={property.subject} />
        }
        label={property.shortname}
        disabled={disabled}
      >
        {'This field is calculated server-side, edits will not be saved. '}
        <Button subtle onClick={() => setCollapsedDynamic(false)}>
          edit anyway
        </Button>
      </Field>
    );
  }

  return (
    <Field
      helper={
        <HelperText text={property.description} link={property.subject} />
      }
      label={property.shortname}
      handleDelete={handleDelete}
      required={required}
      disabled={disabled}
    >
      <InputSwitcher
        data-test={`input-${property.shortname}`}
        resource={resource}
        property={property}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
      />
    </Field>
  );
}

interface HelperTextProps {
  text: string;
  link: string;
}

const HelperTextWraper = styled.div`
  position: relative;
  margin-bottom: 0rem;
`;

function HelperText({ text, link }: HelperTextProps) {
  return (
    <HelperTextWraper>
      <Markdown text={text} />
      <AtomicLink subject={link}>Go to Property</AtomicLink>
    </HelperTextWraper>
  );
}

/** A single field in a Resource form should receive these */
export type InputProps = {
  /** The resource that is being edited */
  resource: Resource;
  /** The property of the resource that is being edited */
  property: Property;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
  disabled?: boolean;
  /** Whether the field should be focused on render */
  autoFocus?: boolean;
};

interface IFieldProps {
  /** Subject of the Property */
  propertyURL: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
  disabled?: boolean;
  /** Whether the field should be focused on render */
  autoFocus?: boolean;
  /**
   * This function will be called when the delete icon is clicked. This should
   * remove the item from any parent list
   */
  handleDelete?: () => unknown;
}

export default ResourceField;
