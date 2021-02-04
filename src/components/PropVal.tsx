import React from 'react';
import { useResource } from '../lib/react';
import { Value } from '../lib/store';

type Props = {
  propertyURL: string;
  value: Value;
};

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const property = useResource(propertyURL);

  return (
    <p>
      <a href={propertyURL}>{property?.get('https://atomicdata.dev/properties/shortname') || propertyURL}</a>
      <div>{value.toString()}</div>
    </p>
  );
}

export default PropVal;
