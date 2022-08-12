import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useString, useResource, useTitle, urls } from '@tomic/react';
import { ErrorLook } from '../../../views/ResourceInline';
import { useCurrentSubject } from '../../../helpers/useCurrentSubject';
import { SideBarItem } from '../SideBarItem';
import AtomicLink from '../../AtomicLink';
import styled from 'styled-components';
import { useChildren } from '../../../hooks/useChildren';
import { Details } from '../../Details';

interface ResourceSideBarProps {
  subject: string;
  handleClose?: () => unknown;
  onOpen?: (open: boolean) => void;
}

// These should not show a collapse/dropdown with their children when rendered inside the sidebar
const noChildClasses = new Set([
  urls.classes.chatRoom,
  urls.classes.document,
  urls.classes.collection,
]);

/** Renders a Resource as a nav item for in the sidebar. */
export function ResourceSideBar({
  subject,
  handleClose,
  onOpen,
}: ResourceSideBarProps): JSX.Element {
  const spanRef = useRef<HTMLSpanElement>(null);
  const resource = useResource(subject, { allowIncomplete: true });
  const [currentUrl] = useCurrentSubject();
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const [classType] = useString(resource, urls.properties.isA);

  const active = currentUrl === subject;
  const [open, setOpen] = useState(active);

  const children = useChildren(subject);

  const hasChildren = children.length > 0;
  const showChildren = !noChildClasses.has(classType) && hasChildren;

  const handleDetailsToggle = useCallback((state: boolean) => {
    if (!state) {
      setOpen(false);
    }
  }, []);

  const setAndPropagateOpen = useCallback(
    (state: boolean) => {
      setOpen(state);
      onOpen?.(state);
    },
    [onOpen],
  );

  useEffect(() => {
    if (active) {
      onOpen?.(true);
    }
  }, [active]);

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
      <SideBarItem
        onClick={handleClose}
        disabled={active}
        resource={subject}
        ref={spanRef}
      >
        <ErrorLook about={subject} title={resource.getError().message}>
          {subject}
        </ErrorLook>
      </SideBarItem>
    );
  }

  return (
    <Details
      open={open}
      disabled={!showChildren}
      onStateToggle={handleDetailsToggle}
      title={
        <Title subject={subject} clean active={active}>
          <SideBarItem
            onClick={handleClose}
            disabled={active}
            resource={subject}
            title={description ? description : null}
            ref={spanRef}
          >
            {title}
          </SideBarItem>
        </Title>
      }
    >
      {showChildren &&
        children.map(child => (
          <ResourceSideBar
            subject={child}
            key={child}
            onOpen={setAndPropagateOpen}
          />
        ))}
    </Details>
  );
}

interface TitleProps {
  active: boolean;
}

const Title = styled(AtomicLink)<TitleProps>`
  ${SideBarItem} {
    cursor: pointer;
    color: ${({ active, theme: { colors } }) =>
      active ? colors.main : colors.textLight};
    padding-left: 0px;
  }
`;
