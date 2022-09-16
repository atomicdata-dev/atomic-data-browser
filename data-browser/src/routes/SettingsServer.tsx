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
import { urls, useProperty, useResource, useStore } from '@tomic/react';
import { Row } from '../components/Row';
import InputResourceArray from '../components/forms/InputResourceArray';
import styled from 'styled-components';
import { isDev } from '../config';
import NewIntanceButton from '../components/NewInstanceButton';

export function SettingsServer(): JSX.Element {
  const { drive: baseURL, setDrive: setBaseURL, agent } = useSettings();
  const [baseUrlInput, setBaseUrlInput] = useState<string>(baseURL);
  const [baseUrlErr, setErrBaseUrl] = useState<Error | undefined>(undefined);
  const store = useStore();
  const agentResource = useResource(agent?.subject);
  const drivesProperty = useProperty(urls.properties.drives);

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
      <h2>Current drive</h2>
      <FieldStyled>
        <LabelStyled>Drive URL</LabelStyled>
        <InputWrapper>
          <InputStyled
            data-test='server-url-input'
            value={baseUrlInput}
            onChange={e => setBaseUrlInput(e.target.value)}
          />
        </InputWrapper>
      </FieldStyled>
      <ErrMessage>{baseUrlErr?.message}</ErrMessage>
      <Row wrapFlex>
        <Button
          onClick={() => handleSetBaseUrl(baseUrlInput)}
          disabled={baseURL === baseUrlInput}
          data-test='server-url-save'
        >
          save
        </Button>
        <p>
          Websocket{' '}
          {store.getDefaultWebSocket()?.readyState === WebSocket.OPEN
            ? 'connected'
            : 'disconnected'}
        </p>
      </Row>
      <Row wrapFlex>
        <Button
          onClick={() => handleSetBaseUrl('https://atomicdata.dev')}
          subtle
          data-test='server-url-atomic'
        >
          AtomicData.dev
        </Button>
        {isDev() && (
          <Button
            onClick={() => handleSetBaseUrl('http://localhost:9883')}
            subtle
            title='Set to the default URL of a locally hosted Atomic-Server, at port 9883.'
            data-test='server-url-localhost'
          >
            localhost
          </Button>
        )}
        <Button onClick={() => handleSetBaseUrl(window.location.origin)} subtle>
          {window.location.origin}
        </Button>
      </Row>
      <Heading>Or create a new one</Heading>
      <NewIntanceButton
        klass={urls.classes.drive}
        label={'Create new drive'}
        subtle
      />
      <Heading>User Drives</Heading>
      <InputResourceArray resource={agentResource} property={drivesProperty} />
    </ContainerNarrow>
  );
}

const Heading = styled.h2`
  margin-top: ${p => p.theme.margin}rem;
`;
