import React from 'react';

type Props = {
  date: Date;
};

/** Renders a Date value */
function DateTime({ date }: Props): JSX.Element {
  return (
    <span title={date.toLocaleString()}>
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
}

export default DateTime;
