import { useProperty, truncateUrl, Resource } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import AtomicLink from './AtomicLink';
import { ValueForm } from './forms/ValueForm';
import { ErrorLook } from '../views/ResourceInline';
import ValueComp from './ValueComp';

type Props = {
  propertyURL: string;
  resource: Resource;
  editable: boolean;
  // If set to true, will render the properties in a left column, and the Values in the right one, but only on large screens.
  columns?: boolean;
};

interface PropValRowProps {
  columns?: boolean;
}

export const PropValRow = styled.div<PropValRowProps>`
  word-break: break-word;
  margin-bottom: 0.5rem;

  @media screen and (min-width: 500px) {
    margin-bottom: ${p => (p.columns ? 0 : '0.5rem')};
    flex-direction: ${p => (p.columns ? 'row' : 'column')};
    display: ${p => (p.columns ? 'flex' : 'block')};
  }
`;

export const PropertyLabel = styled.span`
  font-weight: bold;
  display: block;
  width: 8rem;
`;

/**
 * A single Property / Value renderer that shows a label on the left, and the
 * value on the right. The value is editable.
 */
function PropVal({
  propertyURL,
  resource,
  editable,
  columns,
}: Props): JSX.Element {
  const property = useProperty(propertyURL);
  const truncated = truncateUrl(propertyURL, 10, true);

  if (property.loading) {
    return (
      <PropValRow columns={columns}>
        <PropertyLabel title={propertyURL + ' is loading'}>
          loading...
        </PropertyLabel>
      </PropValRow>
    );
  }

  if (property.error) {
    return (
      <PropValRow columns={columns}>
        <PropertyLabel title={propertyURL + ' could not be loaded'}>
          <AtomicLink subject={propertyURL}>
            <ErrorLook>{truncated}</ErrorLook>
          </AtomicLink>
        </PropertyLabel>
        <code>{JSON.stringify(resource.get(propertyURL))}</code>
      </PropValRow>
    );
  }

  return (
    <PropValRow columns={columns}>
      <AtomicLink subject={propertyURL}>
        <PropertyLabel title={property.description}>
          {property.error ? (
            <ErrorLook>{truncated}</ErrorLook>
          ) : (
            property.shortname || truncated
          )}
          :
        </PropertyLabel>
      </AtomicLink>
      {editable ? (
        <ValueForm resource={resource} propertyURL={propertyURL} noMargin />
      ) : (
        <ValueComp
          datatype={property.datatype}
          value={resource.get(propertyURL)}
        />
      )}
    </PropValRow>
  );
}

export default PropVal;
