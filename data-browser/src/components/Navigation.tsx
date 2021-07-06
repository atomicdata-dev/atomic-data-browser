import * as React from 'react';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaBars, FaUser, FaInfo } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { openURL, searchURL } from '../helpers/navigation';
import { useFocus } from '../helpers/useFocus';
import { ButtonBar } from './Button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { useSettings } from '../helpers/AppSettings';
import { transparentize } from 'polished';
import { SideBar } from './SideBar';
import ResourceContextMenu from './ResourceContextMenu';
import { tryValidURL } from '@tomic/lib';
import { useQueryParam, StringParam } from 'use-query-params';
import { paths } from '../routes/paths';

interface NavWrapperProps {
  children: React.ReactNode;
}

/** Wraps the entire app and adds a navbar at the bottom or the top */
export function NavWrapper({ children }: NavWrapperProps): JSX.Element {
  const { navbarTop } = useSettings();
  const contentRef = React.useRef(null);
  const location = useLocation();

  useEffect(() => {
    contentRef?.current?.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {navbarTop && <NavBar />}
      <SideBarWrapper>
        <SideBar />
        <Content ref={contentRef} topPadding={navbarTop}>
          {children}
        </Content>
      </SideBarWrapper>
      {!navbarTop && <NavBar />}
    </>
  );
}

interface ContentProps {
  topPadding: boolean;
}

const Content = styled.div<ContentProps>`
  display: block;
  flex: 1;
  margin-top: ${props => (props.topPadding ? '2rem' : '0')};
  margin-bottom: ${props => (props.topPadding ? '0' : '2rem')};
  overflow-y: auto;
  /* For smooth navbar position adjustments */
  transition: margin 0.2s;
`;

/** Persistently shown navigation bar */
function NavBar() {
  const [subject] = useCurrentSubject();
  const [input, setInput] = useState<string>('');
  const [query] = useQueryParam('query', StringParam);
  const history = useHistory();
  const [inputRef, setInputFocus] = useFocus();
  const { navbarTop, navbarFloating, sideBarLocked, setSideBarLocked, agent } = useSettings();
  const [showButtons, setShowButtons] = React.useState<boolean>(true);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    setInput(subject);
  }, [subject]);

  useHotkeys('/', e => {
    e.preventDefault();
    //@ts-ignore this does seem callable
    inputRef.current.select();
  });

  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      //@ts-ignore this does seem callable
      inputRef.current.blur();
    },
    { enableOnTags: ['INPUT'] },
  );

  useHotkeys('/', e => {
    e.preventDefault();
    setInputFocus();
  });

  function handleChange(e) {
    setInput(e.target.value);
    try {
      tryValidURL(e.target.value);
      // Replace instead of push to make the back-button behavior better.
      history.replace(openURL(e.target.value));
    } catch (_err) {
      history.replace(searchURL(e.target.value));
    }
  }

  function handleSelect(e) {
    e.target.select();
  }

  /** Checks if the app is running in PWA / stand alone mode or in a browser */
  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

  const handleSubmit = event => {
    event.preventDefault();
    //@ts-ignore this does seem callable
    inputRef.current.blur();
    //@ts-ignore this does seem callable
    document.activeElement.blur();
    handleNavigation(openURL(subject));
  };

  const handleNavigation = (to: string) => {
    history.push(to);
  };

  /** Hide buttons if the input element is quite small */
  function maybeHideButtons() {
    //@ts-ignore this does seem callable
    if (inputRef.current.getBoundingClientRect().width < 280) {
      setShowButtons(false);
    }
  }

  const ConditionalNavbar = navbarFloating ? NavBarFloating : NavBarFixed;

  return (
    <ConditionalNavbar top={navbarTop} floating={navbarFloating} onSubmit={handleSubmit} autoComplete='off'>
      {showButtons && (
        <React.Fragment>
          <ButtonBar leftPadding type='button' onClick={() => setSideBarLocked(!sideBarLocked)} title='Show / hide sidebar (\)'>
            <FaBars />
          </ButtonBar>
          <ButtonBar type='button' onClick={() => handleNavigation(paths.about)} title='Show about page (a)'>
            <FaInfo />
          </ButtonBar>
          {agent && (
            <ButtonBar type='button' onClick={() => handleNavigation(paths.agentSettings)} title='Show current User'>
              <FaUser />
            </ButtonBar>
          )}
          {isInStandaloneMode() && (
            <>
              <ButtonBar type='button' title='Go back' onClick={history.goBack}>
                <FaArrowLeft />
              </ButtonBar>{' '}
              <ButtonBar type='button' title='Go forward' onClick={history.goForward}>
                <FaArrowRight />
              </ButtonBar>
            </>
          )}
          {showButtons && subject && <ResourceContextMenu subject={subject} />}
        </React.Fragment>
      )}
      <input
        autoComplete='false'
        ref={inputRef}
        type='text'
        name='search'
        aria-label='Search'
        onClick={handleSelect}
        onFocus={maybeHideButtons}
        onBlur={() => setShowButtons(true)}
        value={input || ''}
        onChange={handleChange}
        placeholder='Enter an Atomic URL or search   (press "/" )'
      />
    </ConditionalNavbar>
  );
}

interface NavBarStyledProps {
  floating: boolean;
  top: boolean;
}

/** Don't use this directly - use NavBarFloating or NavBarFixed */
const NavBarBase = styled.form<NavBarStyledProps>`
  /* transition: all 0.2s; */
  position: fixed;
  z-index: 100;
  height: 2.5rem;
  display: flex;
  border: solid 1px ${props => props.theme.colors.bg2};
  background-color: ${props => props.theme.colors.bg};

  /* Search bar and buttons */
  input {
    border: none;
    font-size: 0.9rem;
    padding: 0.4rem 1.2rem;
    color: ${props => props.theme.colors.text};
  }

  /* Search bar */
  input[type='text'] {
    flex: 1;
    min-width: 1rem;
    background-color: ${props => props.theme.colors.bg};
    outline: 0;
    border-radius: 999px;
    color: ${p => p.theme.colors.textLight};

    &:hover {
      color: ${p => p.theme.colors.text};
      box-shadow: inset 0 0 0 2px ${props => transparentize(0.6, props.theme.colors.main)};
    }

    &:focus {
      color: ${p => p.theme.colors.text};
      outline: none;
      box-shadow: inset 0 0 0 2px ${props => props.theme.colors.main};
      /* border-radius: ${props => props.theme.radius}; */
      box-sizing: border-box;
      /* outline-offset: -1px; */
    }
  }
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
  bottom: ${props => (props.top ? 'auto' : '2rem')};

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
  border-bottom: ${props => (props.top ? 'solid 1px ' + props.theme.colors.bg2 : 'none')};
  border-top: ${props => (!props.top ? 'solid 1px ' + props.theme.colors.bg2 : 'none')};
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
