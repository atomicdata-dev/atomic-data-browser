import React from 'react';

type Props = {
  date: Date;
};

/** Renders a Date value */
function DateTime({ date }: Props): JSX.Element {
  return <div title={date.toISOString()}>{date.toLocaleDateString()}</div>;
}

export default DateTime;
