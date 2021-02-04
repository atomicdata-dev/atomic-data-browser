import React from 'react';
import { Value } from '../../lib/value';

type Props = {
  value: Value;
};

/** Renders a markdown value */
function Markdown({ value }: Props): JSX.Element {
  return (
    <div>
      {"I'm markdown! "}
      {value.toString()}
    </div>
  );
}

export default Markdown;
