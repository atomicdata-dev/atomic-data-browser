import React from 'react';
import { Value, Datatype } from '@tomic/lib';
import ResourceInline from '../views/ResourceInline';
import DateTime from './datatypes/DateTime';
import Markdown from './datatypes/Markdown';
import Nestedresource from './datatypes/NestedResource';
import ResourceArray from './datatypes/ResourceArray';
import { ErrMessage } from './forms/InputStyles';

type Props = {
  value: Value;
  datatype: Datatype;
  noMargin?: boolean;
};

/** Renders a value in a fitting way, depending on its DataType */
function ValueComp({ value, datatype, noMargin }: Props): JSX.Element {
  try {
    switch (datatype) {
      case Datatype.ATOMIC_URL: {
        const resource = value.toResource();
        if (typeof resource == 'string') {
          return <ResourceInline subject={resource} />;
        }
        return <Nestedresource resource={resource} />;
      }
      case (Datatype.DATE, Datatype.TIMESTAMP):
        return <DateTime date={value.toDate()} />;
      case Datatype.MARKDOWN:
        return <Markdown text={value.toString()} noMargin={noMargin} />;
      case Datatype.RESOURCEARRAY:
        return <ResourceArray subjects={value.toArray()} />;
      default:
        return <div>{value.toString()}</div>;
    }
  } catch (e) {
    return (
      <ErrMessage>
        {e.message} original value: {value.toString()}
      </ErrMessage>
    );
  }
}

export default ValueComp;
