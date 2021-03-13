import * as React from 'react';
import { useArray, useResource, useStore, useString, useTitle } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import { ContainerNarrow } from '../Containers';
import { properties } from '../../helpers/urls';
import Markdown from '../datatypes/Markdown';
import FieldLabeled from '../forms/Field';
import { Button } from '../Button';
import { JSVals } from '../../atomic-lib/value';
import { openURL } from '../../helpers/navigation';

type EndpointProps = {
  resource: Resource;
};

/** A View for Endpoints. */
function EndpointPage({ resource }: EndpointProps): JSX.Element {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [parameters] = useArray(resource, properties.endpoint.parameters);
  const [virtualResource] = useResource(null);
  const store = useStore();

  function constructSubject() {
    // const paramVals: [key: string, value: JSVals][] = [];
    const url = new URL(resource.getSubject());

    parameters.map(async propUrl => {
      const val = virtualResource.get(propUrl);

      if (val != null) {
        const fullprop = await store.getProperty(propUrl);
        // paramVals.push([fullprop.shortname, val.value()]);
        url.searchParams.set(fullprop.shortname, val.toString());
      }
    });
    openURL(url.href);
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>{title} endpoint</h1>
      {description && <Markdown text={description} />}
      {parameters.map(param => {
        return <FieldLabeled key={param} property={param} resource={virtualResource} />;
      })}
      <Button onClick={constructSubject}>Open</Button>
    </ContainerNarrow>
  );
}

export default EndpointPage;
