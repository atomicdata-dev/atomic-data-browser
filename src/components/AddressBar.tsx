import * as React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';

const defaultSubject = 'https://atomicdata.dev/classes';

export function AddressBar(): JSX.Element {
  // Value shown in navbar, after Submitting
  const [subject, setSubject] = useQueryParam('subject', StringParam);

  const handleSubmit = event => {
    event.preventDefault();
    if (subject == undefined || subject == '') {
      setSubject(defaultSubject);
    }
  };

  return (
    <Wrapper onSubmit={handleSubmit}>
      <input type='text' value={subject} onChange={e => setSubject(e.target.value)} placeholder='Enter an Atomic URL' />
      <input type='submit' value='Fetch' />
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

  input {
    border: none;
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
    background-color: ${props => props.theme.colors.bg1};
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
    &:hover {
      cursor: pointer;
      background-color: ${props => props.theme.colors.main1};
    }
    &:active {
      background-color: ${props => props.theme.colors.main2};
    }
  }
`;
