import React from 'react';
import { Datatype } from '../atomic-lib/datatypes';
import { Value } from '../atomic-lib/value';
import ResourceInline from './datatypes/ResourceInline';
import DateTime from './datatypes/DateTime';
import Markdown from './datatypes/Markdown';
import Nestedresource from './datatypes/NestedResource';
import ResourceArray from './datatypes/ResourceArray';

type Props = {
  value: Value;
  datatype: Datatype;
};

/** Renders a value in a fitting way, depending on its DataType */
function ValueComp({ value, datatype }: Props): JSX.Element {
  switch (datatype) {
    case Datatype.ATOMIC_URL: {
      const resource = value.toResource();
      if (typeof resource == 'string') {
        return <ResourceInline url={resource} />;
      }
      return <Nestedresource resource={resource} />;
    }
    case Datatype.DATE:
      return <DateTime date={value.toDate()} />;
    case Datatype.MARKDOWN:
      return <Markdown text={value.toString()} />;
    case Datatype.RESOURCEARRAY:
      return <ResourceArray array={value.toArray()} />;
    case Datatype.TIMESTAMP:
      return <DateTime date={value.toDate()} />;
    default:
      return <div>{value.toString()}</div>;
  }
}

export default ValueComp;
