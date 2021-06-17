import { truncateUrl, Resource } from '@tomic/lib';
import { useProperty } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import AtomicLink from './Link';
import { ValueForm } from './forms/ValueForm';
import { ErrorLook } from './ResourceInline';

type Props = {
  propertyURL: string;
  resource: Resource;
};

export const PropValRow = styled.div`
  display: flex;
  flex-direction: row;
  word-break: break-word;
  @media screen and (max-width: 500px) {
    margin-bottom: 0.5rem;
    flex-direction: column;
  }
`;

export const PropertyLabel = styled.span`
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

  const truncated = truncateUrl(propertyURL, 10, true);

  return (
    <PropValRow>
      <AtomicLink subject={propertyURL}>
        <PropertyLabel title={property.description}>
          {property.error ? <ErrorLook>{truncated}</ErrorLook> : property.shortname || truncated}:
        </PropertyLabel>
      </AtomicLink>
      <ValueForm resource={resource} propertyURL={propertyURL} />
    </PropValRow>
  );
}

export default PropVal;
