import React from 'react';
import { urls } from '../helpers/urls';
import { usePropString, useResource } from '../lib/react';

type Props = {
  subject: string;
};

/** A Resource as a small clickable link with a name. */
function ResourcePreview({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const shortname = usePropString(resource, urls.shortname);
  const description = usePropString(resource, urls.desription);

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
