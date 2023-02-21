import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useString, useResource, useTitle, urls, useArray } from '@tomic/react';
import { useCurrentSubject } from '../../../helpers/useCurrentSubject';
import { SideBarItem } from '../SideBarItem';
import { AtomicLink } from '../../AtomicLink';
import styled from 'styled-components';
import { Details } from '../../Details';
import { FloatingActions, floatingHoverStyles } from './FloatingActions';
import { errorLookStyle } from '../../ErrorLook';
import { LoaderInline } from '../../Loader';
import { getIconForClass } from '../../../views/FolderPage/iconMap';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ResourceSideBarProps {
  subject: string;
  /** When a SideBar item is clicked, we should close the SideBar (on mobile devices) */
  onClick?: () => unknown;
  /**
   * Is called when any of the subResources is the CurrentURL. This is used to
   * recursively open the sidebar menus when the user opens a resource.
   */
  onOpen?: (open: boolean) => void;
}

/** Renders a Resource as a nav item for in the sidebar. */
export function ResourceSideBar({
  subject,
  onClick,
  onOpen,
}: ResourceSideBarProps): JSX.Element {
  const spanRef = useRef<HTMLSpanElement>(null);
  const resource = useResource(subject, { allowIncomplete: true });
  const [currentUrl] = useCurrentSubject();
  const [title] = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);

  const active = currentUrl === subject;
  const [open, setOpen] = useState(active);

  const [subResources] = useArray(resource, urls.properties.subResources);
  const hasSubResources = subResources.length > 0;

  const [classType] = useArray(resource, urls.properties.isA);
  const Icon = getIconForClass(classType[0]!);

  const handleDetailsToggle = useCallback((state: boolean) => {
    setOpen(state);
  }, []);

  const setAndPropagateOpen = useCallback(
    (state: boolean) => {
      setOpen(state);
      onOpen?.(state);
    },
    [onOpen],
  );

  useEffect(() => {
    if (active || open) {
      onOpen?.(true);
    }
  }, [active, open]);

  if (resource.loading) {
    return (
      <SideBarItem
        onClick={onClick}
        disabled={active}
        resource={subject}
        title={`${subject} is loading...`}
      >
        <LoaderInline />
      </SideBarItem>
    );
  }

  if (resource.error) {
    return (
      <StyledLink subject={subject} clean>
        <SideBarItem
          onClick={onClick}
          disabled={active}
          resource={subject}
          ref={spanRef}
        >
          <SideBarErrorWrapper>
            <FaExclamationTriangle />
            Resource with error
          </SideBarErrorWrapper>
        </SideBarItem>
      </StyledLink>
    );
  }

  return (
    <Details
      initialState={open}
      open={open}
      disabled={!hasSubResources}
      onStateToggle={handleDetailsToggle}
      data-test='resource-sidebar'
      title={
        <ActionWrapper>
          <StyledLink subject={subject} clean>
            <SideBarItem
              onClick={onClick}
              disabled={active}
              resource={subject}
              title={description}
              ref={spanRef}
            >
              <TextWrapper>
                <Icon />
                {title}
              </TextWrapper>
            </SideBarItem>
          </StyledLink>
          <FloatingActions subject={subject} />
        </ActionWrapper>
      }
    >
      {hasSubResources &&
        subResources.map(child => (
          <ResourceSideBar
            subject={child}
            key={child}
            onOpen={setAndPropagateOpen}
          />
        ))}
    </Details>
  );
}

const ActionWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin-left: -0.7rem;
  ${floatingHoverStyles}
`;

const StyledLink = styled(AtomicLink)`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
`;

const TextWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    /* color: ${p => p.theme.colors.text}; */
    font-size: 0.8em;
  }
`;

const SideBarErrorWrapper = styled(TextWrapper)`
  margin-left: 1.3rem;
  ${errorLookStyle}
`;
