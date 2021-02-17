import React from 'react';
import styled from 'styled-components';
import { urls } from '../../helpers/urls';
import { useString, useResource, useTitle } from '../../atomic-react/hooks';
import { ResourceStatus } from '../../atomic-lib/resource';
import AtomicLink from '../Link';

type Props = {
  subject: string;
};

/** Renders a Resource in a small, inline link. */
function ResourceInline({ subject: url }: Props): JSX.Element {
  const [resource] = useResource(url);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return null;
  }
  if (status == ResourceStatus.error) {
    return <ErrorLook about={url}>Error: {resource.getError().message}</ErrorLook>;
  }

  return (
    <AtomicLink url={url}>
      <span title={description ? description : null}>{title}</span>
    </AtomicLink>
  );
}

export const ErrorLook = styled.span`
  color: ${props => props.theme.colors.alert};
  font-family: monospace;
`;

export default ResourceInline;
