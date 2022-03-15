import React from 'react';
import { useString, useResource, useTitle } from '@tomic/react';
import { urls } from '@tomic/lib';
import { ErrorLook } from '../views/ResourceInline';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { SideBarItem } from '../components/SideBar';
import AtomicLink from './AtomicLink';

type Props = {
  subject: string;
  handleClose: () => unknown;
};

/** Renders a Resource in a bar for the sidebar. */
export const ResourceSideBar = React.memo(function RSB({
  subject,
  handleClose,
}: Props): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const [currentUrl] = useCurrentSubject();
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const active = currentUrl == subject;

  if (resource.loading) {
    return (
      <SideBarItem
        onClick={handleClose}
        disabled={active}
        resource={subject}
        title={`${subject} is loading...`}
      >
        loading...
      </SideBarItem>
    );
  }
  if (resource.error) {
    return (
      <SideBarItem onClick={handleClose} disabled={active} resource={subject}>
        <ErrorLook about={subject} title={resource.getError().message}>
          {subject}
        </ErrorLook>
      </SideBarItem>
    );
  }

  return (
    <AtomicLink subject={subject} clean>
      <SideBarItem
        onClick={handleClose}
        disabled={active}
        resource={subject}
        title={description ? description : null}
      >
        {title}
      </SideBarItem>
    </AtomicLink>
  );
});
