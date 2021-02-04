import React from 'react';
import { usePropString, useResource, useStore } from '../lib/react';
import AllProps from './AllProps';
// import ErrorBoundary from './ErrorBoundary';

type Props = {
  subject: string;
};

const shortnameUrl = 'https://atomicdata.dev/properties/shortname';
const descriptionUrl = 'https://atomicdata.dev/properties/description';

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function ResourcePage({ subject }: Props): JSX.Element {
  const store = useStore();
  const resource = useResource(subject);
  const shortname = usePropString(resource, shortnameUrl);
  const description = usePropString(resource, descriptionUrl);

  console.log('Re-render...');
  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return (
      <div>
        {shortname && <h1>{shortname}</h1>}
        {description && <p>{description}</p>}
        <AllProps resource={resource} except={[shortnameUrl, descriptionUrl]} />
        <button onClick={() => store.fetchResource(subject)}>refresh</button>
      </div>
    );
  }
}

export default ResourcePage;
