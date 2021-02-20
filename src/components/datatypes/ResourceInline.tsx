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
function ResourceInline({ subject }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return <span about={subject}>...</span>;
  }
  if (status == ResourceStatus.error) {
    return (
      <span about={subject}>
        {subject}
        <br />
        <ErrorLook>
          {subject}Error: {resource.getError().message}
        </ErrorLook>
      </span>
    );
  }

  return (
    <AtomicLink url={subject}>
      <span title={description ? description : null}>{title}</span>
    </AtomicLink>
  );
}

export const ErrorLook = styled.span`
  color: ${props => props.theme.colors.alert};
  font-family: monospace;
`;

export default ResourceInline;
