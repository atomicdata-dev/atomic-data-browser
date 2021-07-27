import * as React from 'react';
import { useArray, useTitle } from '@tomic/react';
import { Resource, properties } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { Card, CardInsideFull, CardRow } from '../components/Card';
import ResourceInline from './ResourceInline';
import { ValueForm } from '../components/forms/ValueForm';

type DrivePageProps = {
  resource: Resource;
};

/** A View for Drives, which function similar to a homepage or dashboard. */
function DrivePage({ resource }: DrivePageProps): JSX.Element {
  const title = useTitle(resource);
  const [children] = useArray(resource, properties.children);

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Card>
        <h1>{title}</h1>
        <ValueForm resource={resource} propertyURL={properties.description} />
        <CardInsideFull>
          {children.map(child => {
            return (
              <CardRow key={child}>
                <ResourceInline subject={child} />
              </CardRow>
            );
          })}
        </CardInsideFull>
      </Card>
    </ContainerNarrow>
  );
}

export default DrivePage;
