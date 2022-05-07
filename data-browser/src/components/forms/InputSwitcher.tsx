import { Datatype } from '@tomic/react';
import React from 'react';
import { InputProps } from './ResourceField';
import InputString from './InputString';
import { InputResource } from './InputResource';
import InputResourceArray from './InputResourceArray';
import InputMarkdown from './InputMarkdown';
import InputNumber from './InputNumber';
import InputBoolean from './InputBoolean';

/** Renders a fitting HTML input depending on the Datatype */
export default function InputSwitcher(props: InputProps): JSX.Element {
  switch (props.property.datatype) {
    case Datatype.STRING: {
      return <InputString {...props} />;
    }
    case Datatype.MARKDOWN: {
      return <InputMarkdown {...props} />;
    }
    case Datatype.SLUG: {
      return <InputString {...props} />;
    }
    // TODO: DateTime selector
    case Datatype.TIMESTAMP:
    case Datatype.INTEGER: {
      return <InputNumber {...props} />;
    }
    case Datatype.ATOMIC_URL: {
      return <InputResource {...props} />;
    }
    case Datatype.RESOURCEARRAY: {
      return <InputResourceArray {...props} />;
    }
    case Datatype.BOOLEAN: {
      return <InputBoolean {...props} />;
    }
    default: {
      return <InputString {...props} />;
    }
  }
}
