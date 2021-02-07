import * as React from 'react';
import { FaHome, FaShare } from 'react-icons/fa';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { copyToClipboard } from '../helpers/copyToClipboard';
import { Button } from './Button';

export function AddressBar(): JSX.Element {
  // Value shown in navbar, after Submitting
  const [subject, setSubject] = useQueryParam('subject', StringParam);

  const handleSubmit = event => {
    event.preventDefault();
  };

  const handleHome = () => {
    setSubject('');
  };

  const handleShare = () => {
    copyToClipboard(subject);
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Button onClick={handleHome} title='Home'>
        <FaHome />
      </Button>
      <input type='text' value={subject} onChange={e => setSubject(e.target.value)} placeholder='Enter an Atomic URL' />
      {/* <input type='submit' value='Fetch' /> */}
      <Button onClick={handleShare} title='Copy resource URL to clipboard' disabled={subject == undefined || subject == ''}>
        <FaShare />
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.form`
  position: fixed;
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
  &:hover {
    border-color: ${props => props.theme.colors.main1};
  }
  background-color: ${props => props.theme.colors.bg1};

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
    background-color: ${props => props.theme.colors.bg};
    &:hover {
      background-color: ${props => props.theme.colors.bg1};
    }
  }
  input[type='submit'] {
    background-color: ${props => props.theme.colors.main};
    color: white;
    &:hover {
      cursor: pointer;
      background-color: ${props => props.theme.colors.main1};
    }
    &:active {
      background-color: ${props => props.theme.colors.main2};
    }
  }
`;
