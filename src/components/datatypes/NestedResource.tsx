import React from 'react';
import { NestedResource } from '../../lib/value';

type Props = {
  resource: NestedResource;
};

/** Renders a Date value */
function Nestedresource({ resource }: Props): JSX.Element {
  return <div title='Nested Resource'>{JSON.stringify(resource)}</div>;
}

export default Nestedresource;
