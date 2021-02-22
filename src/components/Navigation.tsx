import * as React from 'react';
import { FaHome, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { openURL } from '../helpers/navigation';
import { useFocus } from '../helpers/useFocus';
import { ButtonBar } from './Button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { useSettings } from '../helpers/AppSettings';
import { transparentize } from 'polished';

interface AddressBarProps {
  children: React.ReactNode;
}

/** Wraps the entire app and adds a navbar at the bottom or the top */
export function Navigation({ children }: AddressBarProps): JSX.Element {
  const { navbarTop } = useSettings();

  return (
    <>
      {navbarTop && <NavBar />}
      <Content topPadding={navbarTop}>{children}</Content>
      {!navbarTop && <NavBar />}
    </>
  );
}

interface ContentProps {
  topPadding: boolean;
}

const Content = styled.div<ContentProps>`
  transition: margin-top 0.2s ease, margin-bottom 0.2s ease;
  margin-top: ${props => (props.topPadding ? '2rem' : '0')};
  margin-bottom: ${props => (props.topPadding ? '0' : '2rem')};
`;

/** Persistently shown navigation bar */
function NavBar() {
  const [subject, setSubject] = useCurrentSubject();
  const history = useHistory();
  const [inputRef, setInputFocus] = useFocus();
  const { navbarTop, navbarFloating } = useSettings();

  useHotkeys('/', e => {
    e.preventDefault();
    history.push('/');
    //@ts-ignore this does seem callable
    inputRef.current.select();
  });

  useHotkeys(
    'esc',
    e => {
      e.preventDefault();
      console.log('esc');
      //@ts-ignore this does seem callable
      inputRef.current.blur();
    },
    { enableOnTags: ['INPUT'] },
  );

  useHotkeys('/', e => {
    e.preventDefault();
    //@ts-ignore this does seem callable
    setSubject[''];
    setInputFocus();
  });

  function handleChange(e) {
    handleNavigation(openURL(e.target.value));
  }

  function handleSelect(e) {
    e.target.select();
  }

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

  const ConditionalNavbar = navbarFloating ? NavBarFloating : NavBarFixed;

  return (
    <ConditionalNavbar top={navbarTop} floating={navbarFloating} onSubmit={handleSubmit}>
      <ButtonBar type='button' onClick={() => handleNavigation('/')} title='Go home (h)'>
        <FaHome />
      </ButtonBar>
      <ButtonBar type='button' title='Go back' onClick={history.goBack}>
        <FaArrowLeft />
      </ButtonBar>
      <ButtonBar type='button' title='Go forward' onClick={history.goForward}>
        <FaArrowRight />
      </ButtonBar>
      <input
        ref={inputRef}
        type='text'
        onClick={handleSelect}
        value={subject || ''}
        onChange={handleChange}
        placeholder='Enter an Atomic URL or search   (press "/" )'
      />
      <ButtonBar type='button' title='Create a new Resource (n)' onClick={() => handleNavigation('/new')}>
        <FaPlus />
      </ButtonBar>
    </ConditionalNavbar>
  );
}

interface NavBarStyledProps {
  floating: boolean;
  top: boolean;
}

/** Don't use this directly - use NavBarFloating or NavBarFixed */
const NavBarBase = styled.form<NavBarStyledProps>`
  transition: all 0.2s ease;
  position: fixed;
  z-index: 100;
  height: 2.5rem;
  display: flex;
  border: solid 1px ${props => props.theme.colors.bg2};
  background-color: ${props => props.theme.colors.bg1};

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

    &:hover {
      box-shadow: inset 0 0 0 2px ${props => transparentize(0.6, props.theme.colors.main)};
    }
    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px ${props => props.theme.colors.main};
      /* border-radius: ${props => props.theme.radius}; */
      box-sizing: border-box;
      /* outline-offset: -1px; */
    }
  }

  input[type='submit'] {
    background-color: ${props => props.theme.colors.main};
    color: white;
    &:hover {
      cursor: pointer;
      background-color: ${props => props.theme.colors.mainLight};
    }
    &:active {
      background-color: ${props => props.theme.colors.mainDark};
    }
  }
`;

const NavBarFloating = styled(NavBarBase)`
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: 40rem;
  margin: auto;
  /* Center fixed item */
  left: 50%;
  margin-left: -20rem; /* Negative half of width. */
  margin-right: -20rem; /* Negative half of width. */
  top: ${props => (props.top ? '2rem' : 'auto')};
  bottom: ${props => (props.top ? 'auto' : '2rem')};

  @media (max-width: 40rem) {
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
