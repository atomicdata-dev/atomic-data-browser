import React from 'react';
import { formatTimeAgo } from '../../helpers/formatTimeAgo';

type Props = {
  date: Date;
};

/** Renders a Date value */
function DateTime({ date }: Props): JSX.Element {
  return <span title={date.toLocaleString()}>{formatTimeAgo(date)}</span>;
}

export default DateTime;
