import styled from 'styled-components';
import * as React from 'react';
import { useArray, useResource, useTitle } from '@tomic/react';
import { properties } from '@tomic/lib';
import { useHover } from '../helpers/useHover';
import { useSettings } from '../helpers/AppSettings';
import { useWindowSize } from '../helpers/useWindowSize';
import { useHistory } from 'react-router-dom';
import { MenuItemProps } from './DropdownMenu';
import { Button } from './Button';
import { ResourceSideBar } from './ResourceSideBar';
import { Logo } from './Logo';
import {
  FaCog,
  FaExternalLinkAlt,
  FaInfo,
  FaKeyboard,
  FaPencilAlt,
  FaPlus,
  FaUser,
} from 'react-icons/fa';
import { paths } from '../routes/paths';
import { ErrorLook } from '../views/ResourceInline';
import { openURL } from '../helpers/navigation';

/** Amount of pixels where the sidebar automatically shows */
export const SIDEBAR_TOGGLE_WIDTH = 600;

export function SideBar(): JSX.Element {
  const { baseURL } = useSettings();
  const history = useHistory();
  const [ref, hoveringOverSideBar] = useHover<HTMLDivElement>();
  const { navbarTop, sideBarLocked, setSideBarLocked } = useSettings();
  const windowSize = useWindowSize();

  const appMenuItems: MenuItemProps[] = [
    {
      icon: <FaPlus />,
      label: 'new resource',
      helper: 'Create a new Resource, based on a Class (n)',
      onClick: () => {
        history.push(paths.new);
      },
    },
    {
      icon: <FaUser />,
      label: 'user settings',
      helper: 'See and edit the current Agent / User (u)',
      onClick: () => {
        history.push(paths.agentSettings);
      },
    },
    {
      icon: <FaCog />,
      label: 'theme settings',
      helper: 'Edit the theme, current Agent, and more. (t)',
      onClick: () => {
        history.push(paths.themeSettings);
      },
    },
    {
      icon: <FaKeyboard />,
      label: 'keyboard shortcuts',
      helper: 'View the keyboard shortcuts (?)',
      onClick: () => {
        history.push(paths.shortcuts);
      },
    },
    {
      icon: <FaInfo />,
      label: 'about',
      helper: 'Welcome page, tells about this app',
      onClick: () => {
        history.push(paths.about);
      },
    },
  ];

  const aboutMenuItems: MenuItemProps[] = [
    {
      // icon: <FaGithub />,
      icon: <FaExternalLinkAlt />,
      label: 'github',
      helper: 'View the source code for this application',
      onClick: () =>
        window.open('https://github.com/joepio/atomic-data-browser'),
    },
    {
      // icon: <FaDiscord />,
      icon: <FaExternalLinkAlt />,
      label: 'discord',
      helper: 'Chat with the Atomic Data community',
      onClick: () => window.open('https://discord.gg/a72Rv2P'),
    },
    {
      // icon: <FaBook />,
      icon: <FaExternalLinkAlt />,
      label: 'docs',
      helper: 'View the Atomic Data documentation',
      onClick: () => window.open('https://docs.atomicdata.dev'),
    },
  ];

  function isWideScreen(): boolean {
    return windowSize.width > SIDEBAR_TOGGLE_WIDTH;
  }

  /**
   * This is called when the user presses a menu Item, which should result in a
   * closed menu in mobile context
   */
  function handleClickItem() {
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
          handleClickItem();
        }}
      >
        {item.icon && <SideBarIcon>{item.icon}</SideBarIcon>}
        {item.label}
      </SideBarItem>
    );
  }

  return (
    <SideBarContainer>
      <SideBarStyled
        ref={ref}
        locked={isWideScreen() && sideBarLocked}
        exposed={sideBarLocked || (hoveringOverSideBar && isWideScreen())}
      >
        {navbarTop ? <PaddingBig /> : null}
        {/* The key is set to make sure the component is re-loaded when the baseURL changes */}
        <SideBarDrive handleClickItem={handleClickItem} key={baseURL} />
        <SideBarBottom>
          <SideBarHeader>app</SideBarHeader>
          {appMenuItems.map(renderMenuItem)}
          <SideBarHeader>
            <Logo style={{ height: '1.1rem', maxWidth: '100%' }} />
          </SideBarHeader>
          {aboutMenuItems.map(renderMenuItem)}
        </SideBarBottom>
        {navbarTop ? <PaddingSmall /> : <PaddingBig />}
      </SideBarStyled>
      <SideBarOverlay
        onClick={() => setSideBarLocked(false)}
        visible={sideBarLocked && !isWideScreen()}
      />
    </SideBarContainer>
  );
}

interface SideBarDriveProps {
  /** Closes the sidebar on small screen devices */
  handleClickItem: () => any;
}

/** Shows the current Drive, it's children and an option to change to a different Drive */
function SideBarDrive({ handleClickItem }: SideBarDriveProps): JSX.Element {
  const { baseURL } = useSettings();
  const [drive] = useResource(baseURL);
  const [children] = useArray(drive, properties.children);
  const title = useTitle(drive);
  const history = useHistory();

  return (
    <>
      <SideBarHeader title={`Your current baseURL is ${baseURL}`}>
        <Button
          clean
          data-test='sidebar-drive-open'
          onClick={() => {
            handleClickItem();
            history.push(openURL(baseURL));
          }}
        >
          <DriveTitle>{title || baseURL} </DriveTitle>
        </Button>
        <Button
          onClick={() => history.push(paths.serverSettings)}
          icon
          subtle
          data-test='sidebar-drive-edit'
        >
          <FaPencilAlt />
        </Button>
      </SideBarHeader>
      {drive.isReady() ? (
        children.map(child => {
          return (
            <ResourceSideBar
              key={child}
              subject={child}
              handleClose={handleClickItem}
            />
          );
        })
      ) : drive.loading ? null : (
        <SideBarErr>
          {drive.getError()?.message || 'Could not load this baseURL'}
        </SideBarErr>
      )}
    </>
  );
}

interface SideBarStyledProps {
  locked: boolean;
  exposed: boolean;
}

interface SideBarOverlayProps {
  visible: boolean;
}

const DriveTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 1.4rem;
`;

const PaddingSmall = styled('div')`
  min-height: 1rem;
`;

const PaddingBig = styled('div')`
  min-height: 3rem;
`;

const SideBarErr = styled(ErrorLook)`
  padding-left: ${props => props.theme.margin}rem;
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
  display: flex;
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
  background-color: ${p =>
    p.visible ? 'rgba(0, 0, 0, .5)' : 'rgba(0, 0, 0, 0.0)'};
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
  min-height: ${props => props.theme.margin * 0.5 + 1}rem;
  align-items: center;
  justify-content: flex-start;
  color: ${p => p.theme.colors.textLight};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:disabled {
    background-color: ${p => p.theme.colors.bg1};
  }

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
    color: ${p => p.theme.colors.text};
  }
`;

const SideBarIcon = styled.span`
  display: flex;
  margin-right: 0.5rem;
`;
