import React from 'react';
import { properties, urls } from '../helpers/urls';
import { useString, useResource, useTitle } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import AllProps from './AllProps';
import { Container } from './Containers';
import Markdown from './datatypes/Markdown';
import Collection from './CollectionPage';
import ClassDetail from './ClassDetail';
import NewInstanceButton from './NewInstanceButton';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [klass] = useString(resource, properties.isA);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <Container>Loading...</Container>;
  }
  if (status == ResourceStatus.error) {
    return <Container>{resource.getError().message}</Container>;
  }

  switch (klass) {
    case urls.classes.collection:
      return <Collection resource={resource} />;
  }

  return (
    <Container>
      <h1>{title}</h1>
      <ClassDetail resource={resource} />
      {description && <Markdown text={description} />}
      <AllProps resource={resource} except={[properties.shortname, properties.description, properties.isA]} />
      {/* Perhaps this should be an extendible runtime thing, where Classes have potential Actions. */}
      {klass == urls.classes.class && <NewInstanceButton klass={subject} />}
    </Container>
  );
}

export default ResourcePage;
