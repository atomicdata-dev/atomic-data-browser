import React from 'react';
import styled from 'styled-components';
import { properties } from '../helpers/urls';
import { useString, useResource, useTitle } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import AllProps from './AllProps';
import { Container } from './Container';
import ResourceInline from './datatypes/ResourceInline';
import Markdown from './datatypes/Markdown';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourceCard({ subject }: Props): JSX.Element {
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

  // switch (klass) {
  //   case urls.classes.collection:
  //     return <Collection resource={resource} />;
  // }

  return (
    <Card>
      <h2>{title}</h2>
      {klass && (
        <ClassPreview>
          {'is a '}
          <ResourceInline url={klass} />
        </ClassPreview>
      )}
      {description && <Markdown text={description} />}
      <AllProps resource={resource} except={[properties.shortname, properties.description, properties.isA]} />
    </Card>
  );
}

const Card = styled.div`
  border: solid 1px ${props => props.theme.colors.bg2};
  box-shadow: ${props => props.theme.boxShadow};
  padding: 1rem;
  border-radius: 9px;
  margin-bottom: 1rem;
`;

const ClassPreview = styled.div`
  margin-bottom: 0.5rem;
  font-style: italic;
`;

export default ResourceCard;
