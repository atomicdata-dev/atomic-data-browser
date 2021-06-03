import styled from 'styled-components';
import * as React from 'react';
import { useArray, useResource, useStore, useTitle } from '../atomic-react/hooks';
import { properties } from '../helpers/urls';
import ResourceInline from './ResourceInline';
import { useHover } from '../helpers/useHover';
import { useSettings } from '../helpers/AppSettings';
import { useWindowSize } from '../helpers/useWindowSize';
import { useHistory } from 'react-router-dom';
import { MenuItemProps } from './DropdownMenu';
import { Button } from './Button';

export function SideBar(): JSX.Element {
  const store = useStore();
  const [drive] = useResource(store.baseUrl);
  const [children] = useArray(drive, properties.children);
  const history = useHistory();
  const title = useTitle(drive);
  const [ref, hoveringOverSideBar] = useHover<HTMLDivElement>();
  const { navbarTop, sideBarLocked, setSideBarLocked } = useSettings();
  const windowSize = useWindowSize();

  const defaultMenuItems: MenuItemProps[] = [
    {
      label: 'new Resource',
      helper: 'Create a new Resource, based on a Class',
      onClick: () => {
        history.push('/new');
      },
    },
    {
      label: 'shortcuts',
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

  function allowLock(): boolean {
    return windowSize.width > 600;
  }

  function maybeCloseSideBar() {
    // If the window is small, close the sidebar on click
    if (!allowLock()) {
      setSideBarLocked(false);
    }
  }

  return (
    <SideBarStyled
      ref={ref}
      locked={windowSize.width > 600 && sideBarLocked}
      exposed={sideBarLocked || hoveringOverSideBar}
      topPadding={navbarTop}
    >
      <SideBarHeader>{title}</SideBarHeader>
      {children.map(child => {
        return (
          <SideBarItem
            clean
            key={child}
            onClick={() => {
              maybeCloseSideBar();
            }}
          >
            <ResourceInline subject={child} />
          </SideBarItem>
        );
      })}
      {children.length == 0 && <span>No children in this Drive</span>}
      <SideBarHeader>app</SideBarHeader>
      {defaultMenuItems.map(item => {
        return (
          <SideBarItem
            key={item.label}
            title={item.helper}
            clean
            onClick={() => {
              item.onClick();
              maybeCloseSideBar();
            }}
          >
            {item.label}
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

// eslint-disable-next-line prettier/prettier
const SideBarStyled = styled('div') <SideBarStyledProps>`
  z-index: 2;
  box-sizing: border-box;
  background: ${p => p.theme.colors.bg};
  border-right: solid 1px ${p => p.theme.colors.bg2};
  transition: opacity 0.3s, left 0.3s;
  left: ${p => (p.exposed ? '0' : '-14.5rem')};
  /* When the user is hovering, show half opacity */
  opacity: ${p => (p.exposed ? 1 : 0)};
  height: 100vh;
  width: 15rem;
  padding-top: ${p => (p.topPadding ? '3rem' : '1rem')};
  position: ${p => (p.locked ? 'relative' : 'absolute')};
  display: flex;
  flex-direction: column;
`;

const SideBarHeader = styled('div')`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
`;

const SideBarItem = styled(Button)`
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  min-height: 1.6rem;
  align-items: center;
  justify-content: flex-start;
  color: ${p => p.theme.colors.text};

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
  }
`;
