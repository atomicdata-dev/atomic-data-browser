import React from 'react';
import styled from 'styled-components';
import { useProperty } from '../atomic-react/hooks';
import AtomicLink from './Link';
import { Resource } from '../atomic-lib/resource';
import { ValueForm } from './forms/ValueForm';

type Props = {
  propertyURL: string;
  resource: Resource;
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

/** A single Property / Value renderer that shows a label on the left, and the value on the right. The value is editable. */
function PropVal({ propertyURL, resource }: Props): JSX.Element {
  const property = useProperty(propertyURL);

  if (property == null) {
    return null;
  }

  return (
    <PropValRow>
      <AtomicLink url={propertyURL}>
        <PropertyLabel title={property.description}>{property.shortname || propertyURL}:</PropertyLabel>
      </AtomicLink>
      <ValueForm resource={resource} propertyURL={propertyURL} />
    </PropValRow>
  );
}

export default PropVal;
