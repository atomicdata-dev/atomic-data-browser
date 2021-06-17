import * as React from 'react';
import { useArray, useResource, useStore, useString, useTitle } from '../../../atomic-react/hooks';
import { Resource } from '../../../atomic-lib/resource';
import { ContainerNarrow } from '../../components/Containers';
import { properties } from '../../helpers/urls';
import Markdown from '../../components/datatypes/Markdown';
import ResourceField from '../../components/forms/ResourceField';
import { Button } from '../../components/Button';
import { openURL } from '../../helpers/navigation';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();

  /** Create the URL using the variables */
  async function constructSubject() {
    const url = new URL(resource.getSubject());

    await Promise.all(
      parameters.map(async propUrl => {
        const val = virtualResource.get(propUrl);
        if (val != null) {
          const fullprop = await store.getProperty(propUrl);
          url.searchParams.set(fullprop.shortname, val.toString());
        }
      }),
    );
    history.push(openURL(url.href));
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>{title} endpoint</h1>
      {description && <Markdown text={description} />}
      <form onSubmit={constructSubject}>
        {parameters.map((param, i) => {
          return <ResourceField key={param} propertyURL={param} resource={virtualResource} autofocus={i == 0} />;
        })}
      </form>
      <Button onClick={constructSubject}>Open</Button>
    </ContainerNarrow>
  );
}

export default EndpointPage;
