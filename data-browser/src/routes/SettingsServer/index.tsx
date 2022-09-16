import * as React from 'react';
import { Button } from '../../components/Button';
import {
  ErrMessage,
  FieldStyled,
  InputStyled,
  InputWrapper,
  LabelStyled,
} from '../../components/forms/InputStyles';
import { useState } from 'react';
import { useSettings } from '../../helpers/AppSettings';
import { ContainerNarrow } from '../../components/Containers';
import { urls, useArray, useResource } from '@tomic/react';
import { Row } from '../../components/Row';
import { useDriveHistory } from '../../hooks/useDriveHistory';
import { DrivesCard } from './DrivesCard';
import styled from 'styled-components';
import { WSIndicator } from './WSIndicator';

export function SettingsServer(): JSX.Element {
  const { drive: baseURL, setDrive: setBaseURL, agent } = useSettings();
  const agentResource = useResource(agent?.subject);
  const [baseUrlInput, setBaseUrlInput] = useState<string>(baseURL);
  const [baseUrlErr, setErrBaseUrl] = useState<Error>(null);

  const [userDrives] = useArray(agentResource, urls.properties.drives);
  const [_, addDriveToHistory] = useDriveHistory();

  function handleSetBaseUrl(url: string) {
    try {
      setBaseURL(url);
      setBaseUrlInput(url);
      addDriveToHistory(url);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }

  return (
    <ContainerNarrow>
      <HeadingWrapper>
        <h1>Drive Configuration</h1>
        <WSIndicator />
      </HeadingWrapper>
      <FieldStyled>
        <LabelStyled>Current Drive</LabelStyled>
        <Row>
          <InputWrapper>
            <InputStyled
              data-test='server-url-input'
              value={baseUrlInput}
              onChange={e => setBaseUrlInput(e.target.value)}
            />
          </InputWrapper>
          <Button
            onClick={() => handleSetBaseUrl(baseUrlInput)}
            disabled={baseURL === baseUrlInput}
            data-test='server-url-save'
          >
            save
          </Button>
        </Row>
      </FieldStyled>
      <ErrMessage>{baseUrlErr?.message}</ErrMessage>

      <DrivesCard
        userDrives={userDrives}
        onDriveSelect={subject => handleSetBaseUrl(subject)}
      />
    </ContainerNarrow>
  );
}

const HeadingWrapper = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  h1 {
    margin: 0;
  }
  margin-bottom: 1rem;
`;
