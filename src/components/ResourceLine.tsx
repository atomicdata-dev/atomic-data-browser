import React from 'react';
import { urls } from '../helpers/urls';
import { useString, useResource, useTitle } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import { ErrorLook } from '../components/datatypes/ResourceInline';

type Props = {
  subject: string;
};

/** Renders a Resource in a small line item. Not a link. Useful in dropdown. */
function ResourceLine({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <span>Loading...</span>;
  }
  if (status == ResourceStatus.error) {
    return <ErrorLook>Error: {resource.getError().message}</ErrorLook>;
  }

  return (
    <span>
      <b>{title}</b>
      {description ? ` - ${description}` : null}
    </span>
  );
}

export default ResourceLine;
