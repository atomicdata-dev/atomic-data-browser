import React from 'react';
import { Value, Datatype } from '../lib/value';
import Markdown from './datatypes/Markdown';

type Props = {
  value: Value;
};

/** Renders a value in a fitting way, depending on its DataType */
function ValueComp({ value }: Props): JSX.Element {
  console.log('val:', value);
  const datatype = value.getDatatype();
  switch (datatype) {
    case Datatype.MARKDOWN:
      return <Markdown value={value} />;
    default:
      return <div>{value.toString()}</div>;
  }
}

export default ValueComp;
