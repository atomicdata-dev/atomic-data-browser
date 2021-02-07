import React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useProperty } from '../lib/react';
import { Value } from '../lib/value';
import ValueComp from './ValueComp';

type Props = {
  propertyURL: string;
  value: Value;
};

const PropValRow = styled.div`
  display: block;
  margin-bottom: 1rem;
`;

const PropertyLabel = styled.a`
  font-weight: bold;
  display: block;
`;

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  const property = useProperty(propertyURL);

  const handleClickProp = (e): void => {
    e.preventDefault();
    setSubject(propertyURL);
  };

  if (property == null) {
    return null;
  }

  return (
    <PropValRow>
      <PropertyLabel onClick={handleClickProp} href={propertyURL} title={property.description}>
        {property.shortname || propertyURL}
      </PropertyLabel>
      <ValueComp value={value} datatype={property.datatype} />
    </PropValRow>
  );
}

export default PropVal;
