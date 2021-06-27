import React from 'react';
import * as React from 'react';
import { Button } from '../components/Button';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/InputStyles';
import { useState } from 'react';
import { useStore } from '@tomic/react';

export function SettingsBaseUrl(): JSX.Element {
  const store = useStore();
  const [baseUrl, setBaseUrl] = useState<string>(store.getBaseUrl());
  const [baseUrlErr, setErrBaseUrl] = useState<Error>(null);

  function handleSetBaseUrl() {
    try {
      store.setBaseUrl(baseUrl);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }
  return (
    <>
      <h1>Base URL</h1>
      <p>The Base URL is the address of your Atomic Server. If you create something new, this is where the commit will be sent to.</p>
      <FieldStyled>
        <LabelStyled>Base URL</LabelStyled>
        <InputWrapper>
          <InputStyled value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
        </InputWrapper>
      </FieldStyled>
      <ErrMessage>{baseUrlErr}</ErrMessage>
      <Button onClick={handleSetBaseUrl}>save base URL</Button>
    </>
  );
}
