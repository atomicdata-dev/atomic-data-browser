import * as React from 'react';
import { useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ButtonBar } from './Button';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { useSettings } from '../helpers/AppSettings';
import { SideBar } from './SideBar';
import ResourceContextMenu from './ResourceContextMenu';
import { isRunningInTauri } from '../helpers/tauri';
import { shortcuts } from './HotKeyWrapper';
import { MenuBarDropdownTrigger } from './ResourceContextMenu/MenuBarDropdownTrigger';
import { NavBarSpacer } from './NavBarSpacer';
import { Searchbar } from './Searchbar';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface NavWrapperProps {
  children: React.ReactNode;
}

/** Wraps the entire app and adds a navbar at the bottom or the top */
export function NavWrapper({ children }: NavWrapperProps): JSX.Element {
  const { navbarTop, navbarFloating } = useSettings();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    contentRef?.current?.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {navbarTop && <NavBar />}
      <SideBarWrapper>
        <SideBar />
        <Content
          ref={contentRef}
          navbarTop={navbarTop}
          navbarFloating={navbarFloating}
        >
          <NavBarSpacer position='top' />
          {children}
        </Content>
      </SideBarWrapper>
      {!navbarTop && <NavBar />}
    </>
  );
}

interface ContentProps {
  navbarTop: boolean;
  navbarFloating: boolean;
}

const Content = styled.div<ContentProps>`
  display: block;
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid ${p => p.theme.colors.bg2};
  border-left: 1px solid ${p => p.theme.colors.bg2};
  border-top-left-radius: ${p => p.theme.radius};
`;

/** Persistently shown navigation bar */
function NavBar(): JSX.Element {
  const [subject] = useCurrentSubject();
  const navigate = useNavigate();
  const { navbarTop, navbarFloating, sideBarLocked, setSideBarLocked } =
    useSettings();
  const [showButtons, setShowButtons] = React.useState<boolean>(true);

  const machesStandalone = useMediaQuery(
    '(display-mode: standalone) or (display-mode: fullscreen)',
  );

  const isInStandaloneMode = React.useMemo<boolean>(
    () =>
      machesStandalone ||
      //@ts-ignore
      window.navigator.standalone ||
      document.referrer.includes('android-app://') ||
      isRunningInTauri(),
    [machesStandalone],
  );

  /** Hide buttons if the input element is quite small */
  function maybeHideButtons(event: React.FocusEvent<HTMLInputElement>) {
    if (event.target.getBoundingClientRect().width < 280) {
      setShowButtons(false);
    }
  }

  const ConditionalNavbar = navbarFloating ? NavBarFloating : NavBarFixed;

  return (
    <ConditionalNavbar
      top={navbarTop}
      aria-label='search'
      floating={navbarFloating}
    >
      {showButtons && (
        <React.Fragment>
          <ButtonBar
            leftPadding
            type='button'
            onClick={() => setSideBarLocked(!sideBarLocked)}
            title={`Show / hide sidebar (${shortcuts.sidebarToggle})`}
            data-test='sidebar-toggle'
          >
            <FaBars />
          </ButtonBar>
          {isInStandaloneMode && (
            <>
              <ButtonBar
                type='button'
                title='Go back'
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
              </ButtonBar>{' '}
              <ButtonBar
                type='button'
                title='Go forward'
                onClick={() => navigate(1)}
              >
                <FaArrowRight />
              </ButtonBar>
            </>
          )}
        </React.Fragment>
      )}
      <Searchbar
        subject={subject}
        onFocus={maybeHideButtons}
        onBlur={() => setShowButtons(true)}
      />

      {showButtons && subject && (
        <ResourceContextMenu
          isMainMenu
          subject={subject}
          trigger={MenuBarDropdownTrigger}
        />
      )}
    </ConditionalNavbar>
  );
}

interface NavBarStyledProps {
  floating: boolean;
  top: boolean;
}

/** Don't use this directly - use NavBarFloating or NavBarFixed */
const NavBarBase = styled.div<NavBarStyledProps>`
  /* transition: all 0.2s; */
  position: fixed;
  z-index: ${p => p.theme.zIndex.sidebar};
  height: 2.5rem;
  display: flex;
  border: solid 1px ${props => props.theme.colors.bg2};
  background-color: ${props => props.theme.colors.bg};
`;

/** Width of the floating navbar in rem */
const NavBarFloating = styled(NavBarBase)`
  box-shadow: ${props => props.theme.boxShadow};
  box-sizing: border-box;
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: ${props => props.theme.containerWidth + 1}rem;
  margin: auto;
  /* Center fixed item */
  left: 50%;
  margin-left: -${props => (props.theme.containerWidth + 1) / 2}rem;
  margin-right: -${props => (props.theme.containerWidth + 1) / 2}rem;
  top: ${props => (props.top ? '2rem' : 'auto')};
  bottom: ${props => (props.top ? 'auto' : '1rem')};

  @media (max-width: ${props => props.theme.containerWidth}rem) {
    max-width: calc(100% - 1rem);
    left: auto;
    right: auto;
    margin-left: 0.5rem;
    bottom: 0.5rem;
  }
`;

const NavBarFixed = styled(NavBarBase)`
  top: ${props => (props.top ? '0' : 'auto')};
  bottom: ${props => (props.top ? 'auto' : '0')};
  left: 0;
  right: 0;
  border-width: 0;
  border-bottom: ${props =>
    props.top ? 'solid 1px ' + props.theme.colors.bg2 : 'none'};
  border-top: ${props =>
    !props.top ? 'solid 1px ' + props.theme.colors.bg2 : 'none'};
`;

const SideBarWrapper = styled('div')`
  display: flex;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
