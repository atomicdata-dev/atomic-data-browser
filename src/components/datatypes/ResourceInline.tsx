import React from 'react';
import styled from 'styled-components';
import { urls } from '../../helpers/urls';
import { useString, useResource, useTitle } from '../../lib/react';
import { ResourceStatus } from '../../lib/resource';
import Link from '../Link';

type Props = {
  url: string;
};

/** Renders a Resource in a small, inline link. */
function ResourceInline({ url }: Props): JSX.Element {
  const [resource] = useResource(url);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return null;
  }
  if (status == ResourceStatus.error) {
    return <ErrorLook>Error: {resource.getError().message}</ErrorLook>;
  }

  return (
    <Link url={url}>
      <span title={description ? description : null}>{title}</span>
    </Link>
  );
}

export const ErrorLook = styled.div`
  color: ${props => props.theme.colors.alert};
  font-family: monospace;
`;

export default ResourceInline;
