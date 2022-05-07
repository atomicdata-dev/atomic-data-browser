import * as React from 'react';
import { useArray, useTitle, properties } from '@tomic/react';
import { ContainerNarrow } from '../components/Containers';
import { Card, CardInsideFull, CardRow } from '../components/Card';
import ResourceInline from './ResourceInline';
import { ValueForm } from '../components/forms/ValueForm';
import { Button } from '../components/Button';
import { useSettings } from '../helpers/AppSettings';
import AtomicLink from '../components/AtomicLink';
import { FaPlus } from 'react-icons/fa';
import { paths } from '../routes/paths';
import { ResourcePageProps } from './ResourcePage';

/** A View for Drives, which function similar to a homepage or dashboard. */
function DrivePage({ resource }: ResourcePageProps): JSX.Element {
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
        <h3>{title} children:</h3>
        <CardInsideFull>
          {children.map(child => {
            return (
              <CardRow key={child}>
                <ResourceInline subject={child} />
              </CardRow>
            );
          })}
          <CardRow>
            <AtomicLink path={paths.new}>
              <FaPlus /> Create new resource
            </AtomicLink>
          </CardRow>
        </CardInsideFull>
      </Card>
      {baseURL.startsWith('http://localhost') && (
        <p>
          You are running Atomic-Server on `localhost`, which means that it will
          not be available from any other machine than your current local
          device. If you want your Atomic-Server to be available from the web,
          you should set this up at a Domain on a server.
        </p>
      )}
    </ContainerNarrow>
  );
}

export default DrivePage;
