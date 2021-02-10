import { Datatype } from '../../lib/datatypes';
import React from 'react';
import { InputProps } from './Field';
import InputString from './InputString';
import { InputResource } from './InputResource';

export default function InputSwitcher({ resource, property, required }: InputProps): JSX.Element {
  switch (property.datatype) {
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
      return <InputResource resource={resource} property={property} required={required} />;
    }
    case Datatype.RESOURCEARRAY: {
      return <InputResource resource={resource} property={property} required={required} />;
    }
    default: {
      return <InputString resource={resource} property={property} required={required} />;
    }
  }
}
