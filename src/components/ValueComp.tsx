import React from 'react';
import { Datatype } from '../lib/datatypes';
import { Value } from '../lib/value';
import AtomicUrl from './datatypes/AtomicUrl';
import Markdown from './datatypes/Markdown';
import ResourceArray from './datatypes/ResourceArray';

type Props = {
  value: Value;
  datatype: Datatype;
};

/** Renders a value in a fitting way, depending on its DataType */
function ValueComp({ value, datatype }: Props): JSX.Element {
  switch (datatype) {
    case Datatype.ATOMIC_URL:
      return <AtomicUrl url={value.toString()} />;
    case Datatype.DATE | Datatype.TIMESTAMP:
      return <div>{value.toDate().toLocaleDateString()}</div>;
    // case Datatype.TIMESTAMP:
    //   return <div>{value.toDate()}</div>;
    case Datatype.MARKDOWN:
      return <Markdown text={value.toString()} />;
    case Datatype.RESOURCEARRAY:
      return <ResourceArray array={value.toArray()} />;
    default:
      return <div>{value.toString()}</div>;
  }
}

export default ValueComp;
