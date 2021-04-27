import React from 'react';
import styled from 'styled-components';
import { useProperty } from '../atomic-react/hooks';
import { Value } from '../atomic-lib/value';
import AtomicLink from './Link';
import ValueComp from './ValueComp';

type Props = {
  propertyURL: string;
  value: Value;
};

const PropValRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const PropertyLabel = styled.span`
  font-weight: bold;
  display: block;
  width: 8rem;
`;

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const property = useProperty(propertyURL);

  if (property == null) {
    return null;
  }

  return (
    <PropValRow>
      <AtomicLink url={propertyURL}>
        <PropertyLabel title={property.description}>{property.shortname || propertyURL}:</PropertyLabel>
      </AtomicLink>
      <div>
        <ValueComp value={value} datatype={property.datatype} />
      </div>
    </PropValRow>
  );
}

export default PropVal;
