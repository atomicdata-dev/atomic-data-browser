import React from 'react';
import styled from 'styled-components';
import { properties, urls } from '../helpers/urls';
import { usePropString, useResource } from '../lib/react';
import AllProps from './AllProps';
import { Container } from './Container';
import AtomicUrl from './datatypes/AtomicUrl';
import Markdown from './datatypes/Markdown';
import Table from './Table';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const shortname = usePropString(resource, properties.shortname);
  const description = usePropString(resource, properties.description);
  const klass = usePropString(resource, properties.isA);

  if (resource == null) {
    return null;
  }

  switch (klass) {
    case urls.classes.collection:
      return <Table resource={resource} />;
  }

  return (
    <Container>
      {shortname && <h1>{shortname}</h1>}
      {klass && (
        <ClassPreview>
          {'is a '}
          <AtomicUrl url={klass} />
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
