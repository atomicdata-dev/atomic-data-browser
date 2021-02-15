import { Datatype } from '../../atomic-lib/datatypes';
import React from 'react';
import { InputProps } from './Field';
import InputString from './InputString';
import { InputResource } from './InputResource';
import InputResourceArray from './InputResourceArray';
import InputMarkdown from './InputMarkdown';

export default function InputSwitcher({ resource, property, required }: InputProps): JSX.Element {
  switch (property.datatype) {
    case Datatype.STRING: {
      return <InputString resource={resource} property={property} required={required} />;
    }
    case Datatype.MARKDOWN: {
      return <InputMarkdown resource={resource} property={property} required={required} />;
    }
    case Datatype.SLUG: {
      return <InputString resource={resource} property={property} required={required} />;
    }
    case Datatype.ATOMIC_URL: {
      return <InputResource resource={resource} property={property} required={required} />;
    }
    case Datatype.RESOURCEARRAY: {
      return <InputResourceArray resource={resource} property={property} required={required} />;
    }
    default: {
      return <InputString resource={resource} property={property} required={required} />;
    }
  }
}
