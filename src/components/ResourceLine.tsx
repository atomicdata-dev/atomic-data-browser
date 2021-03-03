import React from 'react';
import { urls } from '../helpers/urls';
import { useString, useResource, useTitle } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import { ErrorLook } from '../components/datatypes/ResourceInline';

type Props = {
  subject: string;
};

/** Renders a Resource in a small line item. Not a link. Useful in dropdown. */
function ResourceLine({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  let [description] = useString(resource, urls.properties.description);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <span about={subject}>Loading...</span>;
  }
  if (status == ResourceStatus.error) {
    return <ErrorLook about={subject}>Error: {resource.getError().message}</ErrorLook>;
  }

  const TRUNCATE_LENGTH = 40;
  if (description?.length >= TRUNCATE_LENGTH) {
    description = description.slice(0, TRUNCATE_LENGTH) + '...';
  }

  return (
    <span about={subject}>
      <b>{title}</b>
      {description ? ` - ${description}` : null}
    </span>
  );
}

export default ResourceLine;
