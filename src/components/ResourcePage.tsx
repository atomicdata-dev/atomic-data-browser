import React from 'react';
import { props } from '../helpers/urls';
import { usePropString, useResource, useStore } from '../lib/react';
import AllProps from './AllProps';
import Markdown from './datatypes/Markdown';
// import ErrorBoundary from './ErrorBoundary';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const store = useStore();
  const resource = useResource(subject);
  const shortname = usePropString(resource, props.shortname);
  const description = usePropString(resource, props.desription);

  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return (
      <div>
        {shortname && <h1>{shortname}</h1>}
        {description && <Markdown text={description} />}
        <AllProps resource={resource} except={[props.shortname, props.desription]} />
        <button onClick={() => store.fetchResource(subject)}>refresh</button>
      </div>
    );
  }
}

export default ResourcePage;
