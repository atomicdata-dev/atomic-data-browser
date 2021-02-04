import React from 'react';
import { usePropString, useResource } from '../lib/react';
import AllProps from './AllProps';
import ErrorBoundary from './ErrorBoundary';

type Props = {
  subject: string;
};

const shortnameUrl = 'https://atomicdata.dev/properties/shortname';

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const shortname = usePropString(resource, shortnameUrl);

  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return (
      <ErrorBoundary>
        {shortname && <h1>{shortname}</h1>}
        <AllProps resource={resource} except={[shortnameUrl]} />
      </ErrorBoundary>
    );
  }
}

export default ResourcePage;
