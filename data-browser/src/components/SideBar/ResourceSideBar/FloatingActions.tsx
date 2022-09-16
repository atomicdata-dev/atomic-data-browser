import { useResource, useTitle } from '@tomic/react';
import React, { useCallback } from 'react';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { paths } from '../../../routes/paths';
import { Button } from '../../Button';
import { buildDefaultTrigger } from '../../Dropdown/DefaultTrigger';
import ResourceContextMenu from '../../ResourceContextMenu';

export interface FloatingActionsProps {
  subject: string;
  className?: string;
}

function buildURL(subject: string) {
  const params = new URLSearchParams({
    parentSubject: subject,
  });

  return `${paths.new}?${params.toString()}`;
}

/** Contains actions for a SideBarResource, such as a context menu and a new item button */
export function FloatingActions({
  subject,
  className,
}: FloatingActionsProps): JSX.Element {
  const navigate = useNavigate();
  const parentResource = useResource(subject);
  const [parentName] = useTitle(parentResource);

  const handleAddClick = useCallback(() => {
    const url = buildURL(subject);
    navigate(url);
  }, [subject]);

  return (
    <Wrapper className={className}>
      <SideBarButton
        icon
        subtle
        data-test='add-subresource'
        onClick={handleAddClick}
        title={`Create new resource under ${parentName}`}
      >
        <FaPlus />
      </SideBarButton>
      <ResourceContextMenu
        simple
        subject={subject}
        trigger={SideBarDropDownTrigger}
      />
    </Wrapper>
  );
}

const Wrapper = styled.span`
  visibility: hidden;
  display: none;
`;

export const floatingHoverStyles = css`
  position: relative;
  &:hover ${Wrapper}, &:focus ${Wrapper} {
    visibility: visible;
    display: inline;
  }
`;

export const SideBarButton = styled(Button)`
  color: ${p => p.theme.colors.main};
  border-radius: ${p => p.theme.radius};
  border: unset;
  height: 100%;
  width: 2rem;
  &&:hover,
  &&:focus {
    background-color: ${p => p.theme.colors.bg1} !important;
    box-shadow: unset;
  }
  &&:active {
    background-color: ${p => p.theme.colors.bg2} !important;
  }
`;

const SideBarDropDownTrigger = buildDefaultTrigger(
  <FaEllipsisV />,
  SideBarButton as typeof Button,
);
