import styled from 'styled-components';
import * as React from 'react';
import { useArray, useResource, useStore, useTitle } from '../atomic-react/hooks';
import { properties } from '../helpers/urls';
import ResourceInline from './ResourceInline';
import { useHover } from '../helpers/useHover';
import { useSettings } from '../helpers/AppSettings';

export function SideBar() {
  const store = useStore();
  const [drive] = useResource(store.baseUrl);
  const [children] = useArray(drive, properties.children);
  const title = useTitle(drive);
  const [ref, hoveringOverSideBar] = useHover<HTMLDivElement>();
  const { navbarTop, sideBarLocked, previewSideBar } = useSettings();

  return (
    <SideBarStyled ref={ref} locked={sideBarLocked} exposed={sideBarLocked || hoveringOverSideBar || previewSideBar} topPadding={navbarTop}>
      <SideBarItem>
        <h3>{title}</h3>
      </SideBarItem>
      {children.map(child => {
        return (
          <SideBarItem key={child}>
            <ResourceInline subject={child} />
          </SideBarItem>
        );
      })}
    </SideBarStyled>
  );
}

interface SideBarStyledProps {
  locked: boolean;
  exposed: boolean;
  topPadding: boolean;
}

const SideBarStyled = styled('div') <SideBarStyledProps>`
  z-index: 2;
  box-sizing: border-box;
  background: ${p => p.theme.colors.bg};
  border-right: solid 1px ${p => p.theme.colors.bg2};
  transition: all 0.3s;
  left: ${p => (p.exposed ? '0' : '-14.5rem')};
  opacity: ${p => (p.exposed ? 1 : 0)};
  height: 100vh;
  width: 15rem;
  padding-top: ${p => (p.topPadding ? '3rem' : '1rem')};
  position: ${p => (p.locked ? 'relative' : 'absolute')};
`;

const SideBarItem = styled('div')`
  padding-left: 1rem;
  padding-right: 1rem;
`;

const SubtleSideBarItem = styled('div')``;
