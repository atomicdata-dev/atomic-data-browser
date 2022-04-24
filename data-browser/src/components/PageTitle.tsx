import { Resource, useTitle } from '@tomic/react';
import React from 'react';
import AtomicLink from './AtomicLink';

interface PageTitleProps {
  /** Put in front of the subject's name */
  label?: string;
  resource: Resource;
}

/** An H1 heading title with the subject's name / shortname and some prepended label */
export function PageTitle({ resource, label }: PageTitleProps): JSX.Element {
  const title = useTitle(resource);

  return (
    <h1>
      {label}
      {label ? ' ' : ''}
      <AtomicLink subject={resource.getSubject()}>{title}</AtomicLink>
    </h1>
  );
}
