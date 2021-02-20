import * as React from 'react';
import { FaHome, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { openURL } from '../helpers/navigation';
import { useFocus } from '../helpers/useFocus';
import { ButtonBar } from './Button';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCurrentSubject } from '../helpers/useCurrentSubject';

/** Persistently shown navigation bar */
export function AddressBar(): JSX.Element {
  const [subject, setSubject] = useCurrentSubject();
  const history = useHistory();
  const [inputRef, setInputFocus] = useFocus();
  useHotkeys('/', e => {
    e.preventDefault();
    //@ts-ignore this does seem callable
    // setSubject[''];
    history.push('/');
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
    // e => setSubject(e.target.value);
    handleNavigation(openURL(e.target.value));
  }

  function handleSelect(e) {
    e.target.select();
  }

  const handleSubmit = event => {
    event.preventDefault();
    inputRef.current.blur();
    document.activeElement.blur();
    handleNavigation(openURL(subject));
  };

  const handleNavigation = (to: string) => {
    history.push(to);
  };

  return (
    <AddressBarStyled onSubmit={handleSubmit}>
      <ButtonBar type='button' onClick={() => handleNavigation('/')} title='Home'>
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
      <ButtonBar type='button' title='Create a new Resource' onClick={() => handleNavigation('/new')}>
        <FaPlus />
      </ButtonBar>
    </AddressBarStyled>
  );
}

const AddressBarStyled = styled.form`
  box-shadow: ${props => props.theme.boxShadow};
  position: fixed;
  z-index: 100;
  bottom: 2rem;
  height: 2rem;
  display: flex;
  border: solid 1px ${props => props.theme.colors.main};
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: 40rem;
  margin: auto;
  /* Center fixed item */
  left: 50%;
  margin-left: -20rem; /* Negative half of width. */
  margin-right: -20rem; /* Negative half of width. */
  background-color: ${props => props.theme.colors.bg1};
  &:hover {
    border-color: ${props => props.theme.colors.mainLight};
  }

  @media (max-width: 40rem) {
    max-width: calc(100% - 1rem);
    left: auto;
    right: auto;
    margin-left: 0.5rem;
    bottom: 0.5rem;
  }

  /* Search bar and buttons */
  input {
    border: none;
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
    color: ${props => props.theme.colors.text};
  }

  /* Search bar */
  input[type='text'] {
    flex: 1;
    min-width: 1rem;
    background-color: ${props => props.theme.colors.bg};
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
