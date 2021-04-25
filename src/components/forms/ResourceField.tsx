import * as React from 'react';
import { useProperty } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import AtomicLink from '../Link';
import InputSwitcher from './InputSwitcher';
import { Property } from '../../atomic-lib/store';
import { InputStyled } from './InputStyles';
import Field from './Field';

/** A form field with a label */
function ResourceField({ propertyURL, resource, required }: IFieldProps): JSX.Element {
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
      helper={[
        property.description,
        ' ',
        <AtomicLink key={propertyURL} url={propertyURL}>
          Go to Property
        </AtomicLink>,
      ]}
      label={property.shortname}
    >
      <InputSwitcher resource={resource} property={property} required={required} />
    </Field>
  );
}

/** A single field in a Resource form should receive these */
export type InputProps = {
  /** The resource that is being edited */
  resource: Resource;
  /** The property of the resource that is being edited */
  property: Property;
  required?: boolean;
};

interface IFieldProps {
  /** Subject of the Property */
  propertyURL: string;
  /** The resource being edited */
  resource: Resource;
  /** Whether the field must have a valid value before submitting */
  required?: boolean;
}

export default ResourceField;
