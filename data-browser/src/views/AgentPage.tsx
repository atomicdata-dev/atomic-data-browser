import * as React from 'react';
import { useArray, useTitle } from '@tomic/react';
import { Resource, properties } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { CardRow } from '../components/Card';
import ResourceInline from '../components/ResourceInline';
import { ValueForm } from '../components/forms/ValueForm';

type DrivePageProps = {
  resource: Resource;
};

/** A View for Drives, which function similar to a homepage or dashboard. */
function AgentPage({ resource }: DrivePageProps): JSX.Element {
  const title = useTitle(resource);
  const [children] = useArray(resource, properties.children);

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <ValueForm resource={resource} propertyURL={properties.description} />
      <h1>{title}</h1>
      {children.map(child => {
        return (
          <CardRow key={child}>
            <ResourceInline subject={child} />
          </CardRow>
        );
      })}
    </ContainerNarrow>
  );
}

export default AgentPage;
