import React from 'react';
import { urls } from '../helpers/urls';
import { useString, useResource, useTitle } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import { ErrorLook } from './ResourceInline';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { openURL } from '../helpers/navigation';
import { SideBarItem } from './SideBar';

type Props = {
  subject: string;
  handleClose: () => unknown;
};

/** Renders a Resource in a bar for the sidebar. */
export function ResourceSideBar({ subject, handleClose }: Props): JSX.Element {
  const [resource] = useResource(subject);
  const [currentUrl] = useCurrentSubject();
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const history = useHistory();
  // const store = useStore();
  // store.fetchResource(subject);

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

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return (
      <span about={subject} title={`${subject} is loading..`}>
        ...
      </span>
    );
  }
  if (status == ResourceStatus.error) {
    return (
      <SideBarItem clean onClick={handleClick} disabled={active} resource={subject}>
        <ErrorLook about={subject} title={resource.getError().message}>
          {subject}
        </ErrorLook>
      </SideBarItem>
    );
  }

  return (
    <SideBarItem clean onClick={handleClick} disabled={active} resource={subject}>
      <span title={description ? description : null}>{title}</span>
    </SideBarItem>
  );
}
