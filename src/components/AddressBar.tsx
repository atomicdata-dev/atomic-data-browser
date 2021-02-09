import * as React from 'react';
import { useState } from 'react';
import { FaHome, FaShare, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { copyToClipboard } from '../helpers/copyToClipboard';
import { createSubjectUrl } from '../helpers/navigation';
import { ButtonBar } from './Button';

export function AddressBar(): JSX.Element {
  // Value shown in navbar, after Submitting
  const [subjectQ] = useQueryParam('subject', StringParam);
  const [subject, setSubject] = useState<string>(subjectQ);
  const history = useHistory();

  const handleSubmit = event => {
    event.preventDefault();
    // console.log('handleSubmit fired', event);
    handleNavigation(createSubjectUrl(subject));
  };

  const handleShare = () => {
    copyToClipboard(subject);
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
      <input type='text' value={subject} onChange={e => setSubject(e.target.value)} placeholder='Enter an Atomic URL' />
      {/* <input type='submit' value='Fetch' /> */}
      <ButtonBar type='button' title='Create a new Resource' onClick={() => handleNavigation('/new')}>
        <FaPlus />
      </ButtonBar>
      <ButtonBar
        type='button'
        title='Copy resource URL to clipboard'
        onClick={handleShare}
        disabled={subject == undefined || subject == ''}
      >
        <FaShare />
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
    max-width: 100%;
    margin: auto;
    left: auto;
    right: auto;
  }

  input {
    border: none;
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
    color: ${props => props.theme.colors.text};
  }

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
