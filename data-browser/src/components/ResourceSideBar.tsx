import React from 'react';
import { useString, useResource, useTitle } from '@tomic/react';
import { urls } from '@tomic/lib';
import { ErrorLook } from '../views/ResourceInline';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { openURL } from '../helpers/navigation';
import { SideBarItem } from '../components/SideBar';

type Props = {
  subject: string;
  handleClose: () => unknown;
};

/** Renders a Resource in a bar for the sidebar. */
export function ResourceSideBar({ subject, handleClose }: Props): JSX.Element {
  const [resource] = useResource(subject, { allowIncomplete: true });
  const [currentUrl] = useCurrentSubject();
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const history = useHistory();

  const active = currentUrl == subject;

  const handleClick = () => {
    const url = new URL(subject);
    handleClose();
    if (currentUrl == subject) {
      return;
    }
    if (window.location.origin == url.origin) {
      const path = url.pathname + url.search;
      history.push(path);
    } else {
      history.push(openURL(subject));
    }
  };

  if (resource.loading) {
    return (
      <SideBarItem
        clean
        onClick={handleClick}
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
      <SideBarItem
        clean
        onClick={handleClick}
        disabled={active}
        resource={subject}
      >
        <ErrorLook about={subject} title={resource.getError().message}>
          {subject}
        </ErrorLook>
      </SideBarItem>
    );
  }

  return (
    <SideBarItem
      clean
      onClick={handleClick}
      disabled={active}
      resource={subject}
    >
      <span title={description ? description : null}>{title}</span>
    </SideBarItem>
  );
}
