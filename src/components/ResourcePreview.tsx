import React from 'react';
import { usePropString, useResource } from '../lib/react';

type Props = {
  subject: string;
};

/** A Resource as a small clickable link with a name. */
function ResourcePreview({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const shortname = usePropString(resource, 'https://atomicdata.dev/properties/shortname');
  const description = usePropString(resource, 'https://atomicdata.dev/properties/description');

  if (resource == undefined) {
    return <p>Resource ${subject} is undefined.</p>;
  } else {
    return (
      <a href={subject} title={description}>
        {shortname}
      </a>
    );
  }
}

export default ResourcePreview;
