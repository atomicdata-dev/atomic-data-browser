import React, { useState } from 'react';
import styled from 'styled-components';

import { Store } from './lib/store';
import ResourcePage from './components/ResourcePage';
import { checkValidURL } from './lib/client';
import { StringParam, useQueryParam } from 'use-query-params';
import { GlobalStyle } from './styling';

/** Initialize the store */
const store = new Store('https://surfy.ddns.net/');
/** Add some basic resources */
store.populate();

/** Entrypoint of the application */
function App(): JSX.Element {
  const defaultSubject = 'https://atomicdata.dev/collections';
  // Value in the form field
  const [subjectInternal, setSubjectInternal] = useState<string>(defaultSubject);
  // Value shown in navbar, after Submitting
  const [subject, setSubject] = useQueryParam('subject', StringParam);

  const handleSubjectChange = (subj: string) => {
    try {
      checkValidURL(subj);
      setSubjectInternal(subj);
    } catch (e) {
      setSubjectInternal(subj);
      return;
    }
    setSubjectInternal(subj);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSubject(subjectInternal);
  };

  return (
    <Container>
      <GlobalStyle />
      <AddressBar onSubmit={handleSubmit}>
        <input type='text' value={subjectInternal} onChange={e => handleSubjectChange(e.target.value)} placeholder='Enter an Atomic URL' />
        <input type='submit' value='Fetch' />
      </AddressBar>
      {subject && <ResourcePage key={subject} subject={subject} />}
    </Container>
  );
}

const AddressBar = styled.form`
  position: fixed;
  bottom: 2rem;
  height: 2rem;
  display: flex;
  border: solid 1px black;
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: 40rem;
  margin: auto;

  input {
    border: none;
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
  }
  input[type='text'] {
    flex: 1;
    &:hover {
      background-color: ${props => props.theme.colors.bg1};
    }
  }
  input[type='submit'] {
    &:hover {
      cursor: pointer;
      background-color: ${props => props.theme.colors.main};
      color: white;
    }
  }
`;

const Container = styled.div`
  max-width: 40rem;
  margin: auto;
`;

export default App;
