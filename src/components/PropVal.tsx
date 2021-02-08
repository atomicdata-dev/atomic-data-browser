import React from 'react';
import styled from 'styled-components';
import { useProperty } from '../lib/react';
import { Value } from '../lib/value';
import Link from './Link';
import ValueComp from './ValueComp';

type Props = {
  propertyURL: string;
  value: Value;
};

const PropValRow = styled.div`
  display: block;
  margin-bottom: ${props => props.theme.margin}rem;
`;

const PropertyLabel = styled.span`
  font-weight: bold;
  display: block;
`;

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const property = useProperty(propertyURL);

  if (property == null) {
    return null;
  }

  return (
    <PropValRow>
      <Link url={propertyURL}>
        <PropertyLabel title={property.description}>{property.shortname || propertyURL}</PropertyLabel>
      </Link>
      <ValueComp value={value} datatype={property.datatype} />
    </PropValRow>
  );
}

export default PropVal;
