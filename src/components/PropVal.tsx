import React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { urls } from '../helpers/urls';
import { datatypeFromUrl } from '../lib/datatypes';
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
  display: block;
`;

/** A single Property / Value renderer */
function PropVal({ propertyURL, value }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  // TODO: Add useProperty
  const property = useResource(propertyURL);
  const datatype = datatypeFromUrl(property?.get(urls.properties.datatype)?.toString());

  const handleClickProp = (e): void => {
    e.preventDefault();
    setSubject(propertyURL);
  };

  return (
    <PropValRow>
      <PropertyLabel onClick={handleClickProp} href={propertyURL} title={property?.get(urls.properties.description)?.toString()}>
        {property?.get(urls.properties.shortname)?.toString() || propertyURL}
      </PropertyLabel>
      <ValueComp value={value} datatype={datatype} />
    </PropValRow>
  );
}

export default PropVal;
