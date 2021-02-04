import React from 'react';
import { urls } from '../helpers/urls';
import { usePropString, useResource, useStore } from '../lib/react';
import AllProps from './AllProps';
// import ErrorBoundary from './ErrorBoundary';

type Props = {
  subject: string;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const store = useStore();
  const resource = useResource(subject);
  const shortname = usePropString(resource, urls.shortname);
  const description = usePropString(resource, urls.desription);

  console.log('Re-render...');
  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return (
      <div>
        {shortname && <h1>{shortname}</h1>}
        {description && <p>{description}</p>}
        <AllProps resource={resource} except={[urls.shortname, urls.desription]} />
        <button onClick={() => store.fetchResource(subject)}>refresh</button>
      </div>
    );
  }
}

export default ResourcePage;
