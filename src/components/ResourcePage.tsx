import React from 'react';
import { properties, urls } from '../helpers/urls';
import { useString, useResource, useTitle, useStore } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from './AllProps';
import { ContainerNarrow } from './Containers';
import Collection from '../views/CollectionPage';
import ClassDetail from './ClassDetail';
import NewInstanceButton from './NewInstanceButton';
import { useHistory } from 'react-router-dom';
import { editURL } from '../helpers/navigation';
import { Button } from './Button';
import { ErrorLook } from './ResourceInline';
import EndpointPage from '../views/EndpointPage';
import { ValueForm } from './forms/ValueForm';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const history = useHistory();
  const [klass] = useString(resource, properties.isA);
  const store = useStore();

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (status == ResourceStatus.error) {
    return (
      <ContainerNarrow>
        <h1>⚠️ {title}</h1>
        <ErrorLook>{resource.getError().message}</ErrorLook>
        <br />
        <Button onClick={() => store.fetchResource(subject, true)}>Retry</Button>
        <Button onClick={() => store.fetchResource(subject, true, true)}>Use proxy</Button>
      </ContainerNarrow>
    );
  }

  switch (klass) {
    case urls.classes.collection:
      return <Collection resource={resource} />;
    case urls.classes.endpoint:
      return <EndpointPage resource={resource} />;
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>{title}</h1>
      <ClassDetail resource={resource} />
      <ValueForm resource={resource} propertyURL={properties.description} />
      <AllProps resource={resource} except={[properties.shortname, properties.description, properties.isA, properties.name]} />
      {/* Perhaps this should be an extendible runtime thing, where Classes have potential Actions. */}
      {klass == urls.classes.class && <NewInstanceButton klass={subject} />}
      <Button onClick={() => history.push(editURL(subject))}>edit</Button>
    </ContainerNarrow>
  );
}

export default ResourcePage;
