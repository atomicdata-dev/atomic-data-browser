import React from 'react';
import {
  useString,
  useResource,
  useTitle,
  urls,
  isValidURL,
} from '@tomic/react';
import { AtomicLink } from '../components/AtomicLink';
import { ErrorLook } from '../components/ErrorLook';

type Props = {
  subject: string;
  untabbable?: boolean;
};

/** Renders a Resource in a compact, inline link. Shows tooltip on hover. */
export function ResourceInline({ subject, untabbable }: Props): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const [title] = useTitle(resource);
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

  if (!isValidURL(subject)) {
    return <ErrorLook>{subject} is not a valid URL</ErrorLook>;
  }

  if (resource.error) {
    return (
      <AtomicLink subject={subject} untabbable={untabbable}>
        <ErrorLook about={subject} title={resource.error.message}>
          {title}
        </ErrorLook>
      </AtomicLink>
    );
  }

  return (
    <AtomicLink subject={subject} untabbable={untabbable}>
      <span title={description ? description : ''}>{title}</span>
    </AtomicLink>
  );
}
