import styled from 'styled-components';
import * as React from 'react';
import { useArray, useResource, useTitle, properties } from '@tomic/react';
import { useHover } from '../helpers/useHover';
import { useSettings } from '../helpers/AppSettings';
import { useWindowSize } from '../helpers/useWindowSize';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ResourceSideBar } from './ResourceSideBar';
import { Logo } from './Logo';
import {
  FaCog,
  FaExternalLinkAlt,
  FaInfo,
  FaKeyboard,
  FaPlus,
  FaServer,
  FaUser,
} from 'react-icons/fa';
import { paths } from '../routes/paths';
import { ErrorLook } from '../views/ResourceInline';
import { openURL } from '../helpers/navigation';
import { SignInButton } from './SignInButton';
import AtomicLink, { AtomicLinkProps } from './AtomicLink';

/** Amount of pixels where the sidebar automatically shows */
export const SIDEBAR_TOGGLE_WIDTH = 600;

const aboutMenuItems: SideBarMenuItemProps[] = [
  {
    // icon: <FaGithub />,
    icon: <FaExternalLinkAlt />,
    label: 'github',
    helper: 'View the source code for this application',
    href: 'https://github.com/joepio/atomic-data-browser',
  },
  {
    // icon: <FaDiscord />,
    icon: <FaExternalLinkAlt />,
    label: 'discord',
    helper: 'Chat with the Atomic Data community',
    href: 'https://discord.gg/a72Rv2P',
  },
  {
    // icon: <FaBook />,
    icon: <FaExternalLinkAlt />,
    label: 'docs',
    helper: 'View the Atomic Data documentation',
    href: 'https://docs.atomicdata.dev',
  },
];

export function SideBar(): JSX.Element {
  const { baseURL } = useSettings();
  const { navbarTop, sideBarLocked, setSideBarLocked } = useSettings();
  const [ref, hoveringOverSideBar] = useHover<HTMLDivElement>(sideBarLocked);
  const windowSize = useWindowSize();

  const appMenuItems: SideBarMenuItemProps[] = React.useMemo(() => {
    return [
      {
        icon: <FaPlus />,
        label: 'new resource',
        helper: 'Create a new Resource, based on a Class (n)',
        path: paths.new,
      },
      {
        icon: <FaUser />,
        label: 'user settings',
        helper: 'See and edit the current Agent / User (u)',
        path: paths.agentSettings,
      },
      {
        icon: <FaCog />,
        label: 'theme settings',
        helper: 'Edit the theme, current Agent, and more. (t)',
        path: paths.themeSettings,
      },
      {
        icon: <FaKeyboard />,
        label: 'keyboard shortcuts',
        helper: 'View the keyboard shortcuts (?)',
        path: paths.shortcuts,
      },
      {
        icon: <FaInfo />,
        label: 'about',
        helper: 'Welcome page, tells about this app',
        path: paths.about,
      },
    ];
  }, []);

  const isWideScreen = React.useCallback(
    () => windowSize.width > SIDEBAR_TOGGLE_WIDTH,
    [windowSize],
  );

  /**
   * This is called when the user presses a menu Item, which should result in a
   * closed menu in mobile context
   */
  const closeSideBar = React.useCallback(() => {
    // If the window is small, close the sidebar on click
    if (!isWideScreen()) {
      setSideBarLocked(false);
    }
  }, [isWideScreen]);

  return (
    <SideBarContainer>
      <SideBarStyled
        ref={ref}
        locked={isWideScreen() && sideBarLocked}
        exposed={sideBarLocked || (hoveringOverSideBar && isWideScreen())}
      >
        {navbarTop ? <PaddingBig /> : null}
        {/* The key is set to make sure the component is re-loaded when the baseURL changes */}
        <SideBarDrive handleClickItem={closeSideBar} key={baseURL} />
        <SideBarBottom>
          <SideBarHeader>app</SideBarHeader>
          {appMenuItems.map(p => (
            <SideBarMenuItem
              key={p.label}
              {...p}
              handleClickItem={closeSideBar}
            />
          ))}{' '}
          <SideBarHeader>
            <Logo style={{ height: '1.1rem', maxWidth: '100%' }} />
          </SideBarHeader>
          {aboutMenuItems.map(p => (
            <SideBarMenuItem
              key={p.label}
              {...p}
              handleClickItem={closeSideBar}
            />
          ))}
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

interface SideBarMenuItemProps extends AtomicLinkProps {
  label: string;
  helper?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Is called when clicking on the item. Used for closing the menu. */
  handleClickItem?: () => void;
}

function SideBarMenuItem({
  helper,
  label,
  icon,
  path,
  href,
  subject,
  handleClickItem,
}: SideBarMenuItemProps) {
  return (
    <AtomicLink href={href} subject={subject} path={path} clean>
      <SideBarItem key={label} title={helper} onClick={handleClickItem}>
        {icon && <SideBarIcon>{icon}</SideBarIcon>}
        {label}
      </SideBarItem>
    </AtomicLink>
  );
}

interface SideBarDriveProps {
  /** Closes the sidebar on small screen devices */
  handleClickItem: () => unknown;
}

/** Shows the current Drive, it's children and an option to change to a different Drive */
const SideBarDrive = React.memo(function SBD({
  handleClickItem,
}: SideBarDriveProps): JSX.Element {
  const { baseURL } = useSettings();
  const { agent } = useSettings();
  const drive = useResource(baseURL);
  const [children] = useArray(drive, properties.children);
  const title = useTitle(drive);
  const navigate = useNavigate();

  return (
    <>
      <SideBarHeader>
        <Button
          clean
          title={`Your current baseURL is ${baseURL}`}
          data-test='sidebar-drive-open'
          onClick={() => {
            handleClickItem();
            navigate(openURL(baseURL));
          }}
          style={{ flex: 1, textAlign: 'left' }}
        >
          <DriveTitle data-test='current-drive-title'>
            {title || baseURL}{' '}
          </DriveTitle>
        </Button>
        <Button
          onClick={() => navigate(paths.serverSettings)}
          icon
          subtle
          title={'Set a different Server'}
          data-test='sidebar-drive-edit'
        >
          <FaServer />
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
          {drive.error ? (
            drive.isUnauthorized() ? (
              agent ? (
                'unauthorized'
              ) : (
                <SignInButton />
              )
            ) : (
              drive.error.message
            )
          ) : (
            'this should not happen'
          )}
        </SideBarErr>
      )}
    </>
  );
});

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
  flex: 1;
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

interface SideBarItemProps {
  disabled?: boolean;
}

/** SideBarItem should probably be wrapped in an AtomicLink for optimal behavior */
// eslint-disable-next-line prettier/prettier
export const SideBarItem = styled('span') <SideBarItemProps>`
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
  text-decoration: none;

  &:disabled {
    background-color: ${p => p.theme.colors.bg1};
  }

  &:hover,
  &:focus {
    background-color: ${p => p.theme.colors.bg1};
    color: ${p => p.theme.colors.text};
  }
`;

const SideBarIcon = styled.span`
  display: flex;
  margin-right: 0.5rem;
  font-size: 1.5rem;
`;
