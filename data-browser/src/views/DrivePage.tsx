import * as React from 'react';
import { useArray, useTitle } from '@tomic/react';
import { Resource, properties } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { Card, CardInsideFull, CardRow } from '../components/Card';
import ResourceInline from './ResourceInline';
import { ValueForm } from '../components/forms/ValueForm';
import { Button } from '../components/Button';
import { useSettings } from '../helpers/AppSettings';

type DrivePageProps = {
  resource: Resource;
};

/** A View for Drives, which function similar to a homepage or dashboard. */
function DrivePage({ resource }: DrivePageProps): JSX.Element {
  const title = useTitle(resource);
  const [children] = useArray(resource, properties.children);
  const { baseURL, setBaseURL } = useSettings();

  return (
    <ContainerNarrow about={resource.getSubject()}>
      {baseURL !== resource.getSubject() && (
        <Button onClick={() => setBaseURL(resource.getSubject())}>
          Set as current drive
        </Button>
      )}
      <ValueForm resource={resource} propertyURL={properties.description} />
      <Card>
        <p>{title} children:</p>
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
