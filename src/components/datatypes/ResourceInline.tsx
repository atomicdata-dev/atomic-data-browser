import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { truncateUrl } from '../../helpers/truncate';
import { urls } from '../../helpers/urls';
import { useString, useResource, useTitle } from '../../lib/react';
import { ResourceStatus } from '../../lib/resource';
import Link from '../Link';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders a markdown value */
function ResourceInline({ children, url }: Props): JSX.Element {
  const resource = useResource(url);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return null;
  }
  if (status == ResourceStatus.error) {
    return <ErrorLook>Error: {resource.getError().message}</ErrorLook>;
  }

  const title = useTitle(resource);

  const description = useString(resource, urls.properties.description);

  return (
    <Link url={url}>
      <span title={description ? description : null}>{title}</span>
    </Link>
  );
}

const ErrorLook = styled.div`
  color: ${props => props.theme.colors.alert};
  font-family: monospace;
`;

export default ResourceInline;
