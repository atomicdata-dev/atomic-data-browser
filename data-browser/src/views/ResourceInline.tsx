import React from 'react';
import styled from 'styled-components';
import { useString, useResource, useTitle, urls } from '@tomic/react';
import AtomicLink from '../components/AtomicLink';

type Props = {
  subject: string;
  untabbable?: boolean;
};

/** Renders a Resource in a small, inline link. */
function ResourceInline({ subject, untabbable }: Props): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  if (!subject) {
    return <ErrorLook>No subject passed</ErrorLook>;
  }

  if (resource.loading) {
    return (
      <span about={subject} title={`${subject} is loading..`}>
        ...
      </span>
    );
  }
  if (resource.error) {
    return (
      <AtomicLink subject={subject} untabbable={untabbable}>
        <ErrorLook about={subject} title={resource.getError().message}>
          {title}
        </ErrorLook>
      </AtomicLink>
    );
  }

  return (
    <AtomicLink subject={subject} untabbable={untabbable}>
      <span title={description ? description : null}>{title}</span>
    </AtomicLink>
  );
}

export const ErrorLook = styled.span`
  color: ${props => props.theme.colors.alert};
  line-height: 1em;
  font-family: monospace;
  display: block;
`;

export default ResourceInline;
