import { useResource, useTitle } from '@tomic/react';
import React from 'react';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import styled, { css } from 'styled-components';
import { useNewRoute } from '../../../helpers/useNewRoute';
import { Button } from '../../Button';
import { buildDefaultTrigger } from '../../Dropdown/DefaultTrigger';
import ResourceContextMenu from '../../ResourceContextMenu';

export interface FloatingActionsProps {
  subject: string;
  className?: string;
}

/** Contains actions for a SideBarResource, such as a context menu and a new item button */
export function FloatingActions({
  subject,
  className,
}: FloatingActionsProps): JSX.Element {
  const parentResource = useResource(subject);
  const [parentName] = useTitle(parentResource);

  const handleAddClick = useNewRoute(subject);

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
