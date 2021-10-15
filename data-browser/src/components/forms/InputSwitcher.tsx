import { Datatype } from '@tomic/lib';
import React from 'react';
import { InputProps } from './ResourceField';
import InputString from './InputString';
import { InputResource } from './InputResource';
import InputResourceArray from './InputResourceArray';
import InputMarkdown from './InputMarkdown';
import InputNumber from './InputNumber';
import InputBoolean from './InputBoolean';

export default function InputSwitcher(props: InputProps): JSX.Element {
  switch (props.property.datatype) {
    case Datatype.STRING: {
      return <InputString {...props} data-test={props.property.subject} />;
    }
    case Datatype.MARKDOWN: {
      return <InputMarkdown {...props} data-test={props.property.subject} />;
    }
    case Datatype.SLUG: {
      return <InputString {...props} data-test={props.property.subject} />;
    }
    // TODO: DateTime selector
    case Datatype.TIMESTAMP:
    case Datatype.INTEGER: {
      return <InputNumber {...props} data-test={props.property.subject} />;
    }
    case Datatype.ATOMIC_URL: {
      // TODO: if it's a nested resource, deal with that
      return <InputResource {...props} data-test={props.property.subject} />;
    }
    case Datatype.RESOURCEARRAY: {
      return (
        <InputResourceArray {...props} data-test={props.property.subject} />
      );
    }
    case Datatype.BOOLEAN: {
      return <InputBoolean {...props} data-test={props.property.subject} />;
    }
    default: {
      return <InputString {...props} data-test={props.property.subject} />;
    }
  }
}
