import React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { urls } from '../helpers/urls';
import { useResource } from '../lib/react';
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
`;

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  const property = useResource(propertyURL);

  const handleClickProp = (e): void => {
    e.preventDefault();
    setSubject(propertyURL);
  };

  return (
    <PropValRow>
      <PropertyLabel onClick={handleClickProp} href={propertyURL} title={property?.get(urls.desription)?.toString()}>
        {property?.get(urls.shortname)?.toString() || propertyURL}
      </PropertyLabel>
      <ValueComp value={value} />
    </PropValRow>
  );
}

export default PropVal;
