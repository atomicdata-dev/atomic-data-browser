import React from 'react';
import { properties, urls } from '../helpers/urls';
import { useString, useResource, useTitle } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from './AllProps';
import Markdown from './datatypes/Markdown';
import AtomicLink from './Link';
import ClassDetail from './ClassDetail';
import { Card } from './Card';
import CollectionCard from './CollectionCard';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourceCard({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [klass] = useString(resource, properties.isA);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return (
      <Card about={subject}>
        <p>Loading...</p>
      </Card>
    );
  }
  if (status == ResourceStatus.error) {
    return (
      <Card about={subject}>
        <p>{resource.getError().message}</p>
      </Card>
    );
  }

  switch (klass) {
    case urls.classes.collection:
      return <CollectionCard resource={resource} />;
  }

  return (
    <Card about={subject}>
      <AtomicLink url={subject}>
        <h2>{title}</h2>
      </AtomicLink>
      <ClassDetail resource={resource} />
      {description && <Markdown text={description} />}
      <AllProps resource={resource} except={[properties.shortname, properties.description, properties.isA]} />
    </Card>
  );
}

export default ResourceCard;
