import React from 'react';
import styled from 'styled-components';
import { props } from '../helpers/urls';
import { usePropString, useResource, useStore } from '../lib/react';
import AllProps from './AllProps';
import AtomicUrl from './datatypes/AtomicUrl';
import Markdown from './datatypes/Markdown';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const store = useStore();
  const resource = useResource(subject);
  const shortname = usePropString(resource, props.shortname);
  const description = usePropString(resource, props.desription);
  const klass = usePropString(resource, props.isA);

  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return (
      <div>
        {shortname && <h1>{shortname}</h1>}
        {klass && (
          <ClassPreview>
            {'is a '}
            <AtomicUrl url={klass} />
          </ClassPreview>
        )}
        {description && <Markdown text={description} />}
        <AllProps resource={resource} except={[props.shortname, props.desription, props.isA]} />
        <button onClick={() => store.fetchResource(subject)}>refresh</button>
      </div>
    );
  }
}

const ClassPreview = styled.div`
  margin-bottom: 0.5rem;
  font-style: italic;
`;

export default ResourcePage;
