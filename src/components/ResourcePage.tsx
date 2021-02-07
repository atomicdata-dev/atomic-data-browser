import React from 'react';
import styled from 'styled-components';
import { properties, urls } from '../helpers/urls';
import { useString, useResource, useStore, useTitle } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import AllProps from './AllProps';
import { Container } from './Container';
import ResourceInline from './datatypes/ResourceInline';
import Markdown from './datatypes/Markdown';
import Table from './Table';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const resource = useResource(subject);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <Container>Loading...</Container>;
  }
  if (status == ResourceStatus.error) {
    return <Container>{resource.getError().message}</Container>;
  }

  const title = useTitle(resource);
  const description = useString(resource, properties.description);
  const klass = useString(resource, properties.isA);

  switch (klass) {
    case urls.classes.collection:
      return <Table resource={resource} />;
  }

  return (
    <Container>
      <h1>{title}</h1>
      {klass && (
        <ClassPreview>
          {'is a '}
          <ResourceInline url={klass} />
        </ClassPreview>
      )}
      {description && <Markdown text={description} />}
      <AllProps resource={resource} except={[properties.shortname, properties.description, properties.isA]} />
    </Container>
  );
}

const ClassPreview = styled.div`
  margin-bottom: 0.5rem;
  font-style: italic;
`;

export default ResourcePage;
