import React from 'react';
import { formatTimeAgo } from '../../helpers/formatTimeAgo';

type Props = {
  date: Date;
};

/** Renders a Date value */
function DateTime({ date }: Props): JSX.Element {
  return <div title={date.toLocaleString()}>{formatTimeAgo(date)}</div>;
}

export default DateTime;
