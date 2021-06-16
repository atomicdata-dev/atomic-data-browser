import * as React from 'react';
import { useProperty } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import AtomicLink from '../Link';
import InputSwitcher from './InputSwitcher';
import { Property } from '../../atomic-lib/store';
import { InputStyled } from './InputStyles';
import Field from './Field';
import Markdown from '../datatypes/Markdown';
import styled from 'styled-components';

/** A form field with a label */
function ResourceField({ handleDelete, propertyURL, resource, required, autofocus }: IFieldProps): JSX.Element {
  const property = useProperty(propertyURL);

  if (property == null) {
    return (
      <Field label='loading...'>
        <InputStyled disabled placeholder='loading property...' />
      </Field>
    );
  }

  return (
    <Field
      helper={<HelperText text={property.description} link={property.subject} />}
      label={property.shortname}
      handleDelete={handleDelete}
    >
      <InputSwitcher resource={resource} property={property} required={required} autofocus={autofocus} />
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
  /** Whether the field should be focused on render */
  autofocus?: boolean;
};

interface IFieldProps {
  /** Subject of the Property */
  propertyURL: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
  /** Whether the field should be focused on render */
  autofocus?: boolean;
  /** This function will be called when the delete icon is clicked. This should remove the item from any parent list */
  handleDelete?: () => unknown;
}

export default ResourceField;
