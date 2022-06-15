import * as React from 'react';
import { Button } from '../components/Button';
import {
  ErrMessage,
  FieldStyled,
  InputStyled,
  InputWrapper,
  LabelStyled,
} from '../components/forms/InputStyles';
import { useState } from 'react';
import { useSettings } from '../helpers/AppSettings';
import { ContainerNarrow } from '../components/Containers';
import { useStore } from '@tomic/react';

export function SettingsServer(): JSX.Element {
  const { baseURL, setBaseURL } = useSettings();
  const [baseUrlInput, setBaseUrlInput] = useState<string>(baseURL);
  const [baseUrlErr, setErrBaseUrl] = useState<Error>(null);
  const store = useStore();

  function handleSetBaseUrl(url: string) {
    try {
      setBaseURL(url);
      setBaseUrlInput(url);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }

  return (
    <ContainerNarrow>
      <h2>Current Server</h2>
      <p>
        The Server is the machine hosting Atomic Data. It is the item shown in
        the sidebar. If you create something new, this is where it will be
        created by default.
      </p>
      <FieldStyled>
        <LabelStyled>Server URL</LabelStyled>
        <InputWrapper>
          <InputStyled
            data-test='server-url-input'
            value={baseUrlInput}
            onChange={e => setBaseUrlInput(e.target.value)}
          />
        </InputWrapper>
      </FieldStyled>
      <ErrMessage>{baseUrlErr}</ErrMessage>
      <Button
        onClick={() => handleSetBaseUrl(baseUrlInput)}
        disabled={baseURL == baseUrlInput}
        data-test='server-url-save'
      >
        save
      </Button>
      <p>Or use:</p>
      <Button
        onClick={() => handleSetBaseUrl('https://atomicdata.dev')}
        subtle
        data-test='server-url-atomic'
      >
        AtomicData.dev
      </Button>
      <Button
        onClick={() => handleSetBaseUrl('http://localhost:9883')}
        subtle
        title='Set to the default URL of a locally hosted Atomic-Server, at port 9883.'
        data-test='server-url-localhost'
      >
        localhost
      </Button>
      <Button onClick={() => handleSetBaseUrl(window.location.origin)} subtle>
        {window.location.origin}
      </Button>
      <p>
        Websocket{' '}
        {store.webSocket.readyState == WebSocket.OPEN
          ? 'connected'
          : 'disconnected'}
      </p>
    </ContainerNarrow>
  );
}
