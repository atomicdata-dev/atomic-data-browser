import React from 'react';
import { Datatype } from '../lib/datatypes';
import { Value } from '../lib/value';
import AtomicUrl from './datatypes/AtomicUrl';
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
        return <AtomicUrl url={resource} />;
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
