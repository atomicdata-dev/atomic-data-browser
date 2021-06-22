import styled from 'styled-components';
import * as React from 'react';
import { useArray, useResource, useStore, useTitle } from '@tomic/react';
import { properties } from '@tomic/lib';
import { useHover } from '../helpers/useHover';
import { useSettings } from '../helpers/AppSettings';
import { useWindowSize } from '../helpers/useWindowSize';
import { useHistory } from 'react-router-dom';
import { MenuItemProps } from './DropdownMenu';
import { Button } from './Button';
import { ResourceSideBar } from './ResourceSideBar';

export function SideBar(): JSX.Element {
  const store = useStore();
  const [drive] = useResource(store.baseUrl);
  const [children] = useArray(drive, properties.children);
  const history = useHistory();
  const title = useTitle(drive);
  const [ref, hoveringOverSideBar] = useHover<HTMLDivElement>();
  const { navbarTop, sideBarLocked, setSideBarLocked } = useSettings();
  const windowSize = useWindowSize();

  const appMenuItems: MenuItemProps[] = [
    {
      label: 'new resource',
      helper: 'Create a new Resource, based on a Class',
      onClick: () => {
        history.push('/new');
      },
    },
    {
      label: 'keyboard shortcuts',
      helper: 'View the keyboard shortcuts',
      onClick: () => {
        history.push('/shortcuts');
      },
    },
    {
      label: 'settings',
      helper: 'Edit the theme, current Agent, and more.',
      onClick: () => {
        history.push('/settings');
      },
    },
    {
      label: 'about',
      helper: 'Welcome page, tells about this app',
      onClick: () => {
        history.push('/');
      },
    },
  ];

  const aboutMenuItems: MenuItemProps[] = [
    {
      label: 'github',
      helper: 'View the source code for this application',
      onClick: () => window.open('https://github.com/joepio/atomic-data-browser'),
    },
    {
      label: 'discord',
      helper: 'Chat with the Atomic Data community',
      onClick: () => window.open('https://discord.gg/a72Rv2P'),
    },
    {
      label: 'docs',
      helper: 'View the Atomic Data documentation',
      onClick: () => window.open('https://docs.atomicdata.dev'),
    },
  ];

  function isWideScreen(): boolean {
    return windowSize.width > 600;
  }

  /** This is called when the user presses a menu Item, which should result in a closed menu in mobile context */
  function handleCloseSideBarMayb() {
    // If the window is small, close the sidebar on click
    if (!isWideScreen()) {
      setSideBarLocked(false);
    }
  }

  function renderMenuItem(item: MenuItemProps) {
    return (
      <SideBarItem
        key={item.label}
        title={item.helper}
        clean
        onClick={() => {
          item.onClick();
          handleCloseSideBarMayb();
        }}
      >
        {item.label}
      </SideBarItem>
    );
  }

  return (
    <SideBarContainer>
      <SideBarStyled
        ref={ref}
        locked={windowSize.width > 600 && sideBarLocked}
        exposed={sideBarLocked || (hoveringOverSideBar && isWideScreen())}
      >
        {navbarTop ? <PaddingBig /> : null}
        <SideBarHeader>{title}</SideBarHeader>
        {children.map(child => {
          return <ResourceSideBar key={child} subject={child} handleClose={handleCloseSideBarMayb} />;
        })}
        <SideBarBottom>
          <SideBarHeader>app</SideBarHeader>
          {appMenuItems.map(renderMenuItem)}
          <SideBarHeader>atomic data</SideBarHeader>
          {aboutMenuItems.map(renderMenuItem)}
        </SideBarBottom>
        {navbarTop ? <PaddingSmall /> : <PaddingBig />}
      </SideBarStyled>
      <SideBarOverlay onClick={() => setSideBarLocked(false)} visible={sideBarLocked && !isWideScreen()} />
    </SideBarContainer>
  );
}

interface SideBarStyledProps {
  locked: boolean;
  exposed: boolean;
}

interface SideBarOverlayProps {
  visible: boolean;
}

const PaddingSmall = styled('div')`
  min-height: 1rem;
`;

const PaddingBig = styled('div')`
  min-height: 3rem;
`;

// eslint-disable-next-line prettier/prettier
const SideBarStyled = styled('div') <SideBarStyledProps>`
  z-index: 10;
  box-sizing: border-box;
  background: ${p => p.theme.colors.bg};
  border-right: solid 1px ${p => p.theme.colors.bg2};
  transition: opacity 0.3s, left 0.3s;
  left: ${p => (p.exposed ? '0' : -p.theme.sideBarWidth + 0.5 + 'rem')};
  /* When the user is hovering, show half opacity */
  opacity: ${p => (p.exposed ? 1 : 0)};
  height: 100vh;
  width: ${p => p.theme.sideBarWidth}rem;
  position: ${p => (p.locked ? 'relative' : 'absolute')};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SideBarHeader = styled('div')`
  margin-top: ${props => props.theme.margin}rem;
  margin-bottom: 0.5rem;
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  font-size: 1.4rem;
  font-weight: bold;
`;

const SideBarBottom = styled('div')`
  margin-top: auto;
  flex-direction: column;
  justify-items: flex-end;
  display: flex;
  justify-content: end;
`;

/** Just needed for positioning the overlay */
const SideBarContainer = styled('div')`
  position: relative;
`;

/** Shown on mobile devices to close the panel */
// eslint-disable-next-line prettier/prettier
const SideBarOverlay = styled('div') <SideBarOverlayProps>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  transition: background-color 0.2s;
  background-color: ${p => (p.visible ? 'rgba(0, 0, 0, .5)' : 'rgba(0, 0, 0, 0.0)')};
  pointer-events: ${p => (p.visible ? 'auto' : 'none')};
  height: 100%;
  cursor: pointer;
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
`;

export const SideBarItem = styled(Button)`
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  display: flex;
  min-height: 1.6rem;
  align-items: center;
  justify-content: flex-start;
  color: ${p => p.theme.colors.textLight};

  &:disabled {
    background-color: ${p => p.theme.colors.bg1};
  }

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
  }
`;
