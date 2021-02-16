import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { localStoreKeyMainColor } from '../styling';
import { ButtonMargin } from '../components/Button';
import { useDarkMode } from '../helpers/useDarkMode';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/InputStyles';
import { useStore } from '../atomic-react/hooks';
import { useState } from 'react';
import { Agent } from '../atomic-lib/agent';
import { Card } from '../components/Card';

const Settings: React.FunctionComponent = () => {
  const [dark, setDark] = useDarkMode();
  const store = useStore();
  const [agentSubject, setCurrentAgent] = useState<string>(null);
  const [privateKey, setCurrentPrivateKey] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(store.getBaseUrl());
  const [agentErr, setErrAgent] = useState<Error>(null);
  const [baseUrlErr, setErrBaseUrl] = useState<Error>(null);

  if (agentSubject == null)
    try {
      setCurrentAgent(store.getAgent().subject);
      setCurrentPrivateKey(store.getAgent().privateKey);
    } catch (err) {
      // setErrAgent(err);
      setCurrentAgent('');
    }

  function handleSetAgent() {
    try {
      const agent = new Agent(agentSubject, privateKey);
      store.setAgent(agent);
    } catch (e) {
      setErrAgent(e);
    }
  }

  function handleSetDark() {
    setDark(!dark);
    window.location.reload();
  }

  function handleSetBaseUrl() {
    try {
      store.setBaseUrl(baseUrl);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }

  return (
    <ContainerNarrow>
      <h1>Settings</h1>
      <Card>
        <h2>Theme</h2>
        <ButtonMargin onClick={handleSetDark}>{dark ? 'turn off' : 'turn on'} dark mode</ButtonMargin>
        <MainColorPicker />
        <br />
      </Card>
      <Card>
        <h2>Agent</h2>
        <p>
          An Agent is a user, consisting of a Subject (its URL) and Private Key. Together, these can be used to edit data and sign Commits.
          Creating an Agent currently requires setting up an <a href='https://github.com/joepio/atomic/tree/master/server'>atomic-server</a>
          .
        </p>
        <FieldStyled>
          <LabelStyled>Agent Subject URL</LabelStyled>
          <InputWrapper>
            <InputStyled value={agentSubject} onChange={e => setCurrentAgent(e.target.value)} />
          </InputWrapper>
        </FieldStyled>
        <FieldStyled>
          <LabelStyled>Private Key</LabelStyled>
          <InputWrapper>
            <InputStyled value={privateKey} onChange={e => setCurrentPrivateKey(e.target.value)} />
          </InputWrapper>
          <ErrMessage>{agentErr?.message}</ErrMessage>
        </FieldStyled>
        <ButtonMargin onClick={handleSetAgent}>save agent</ButtonMargin>
      </Card>
      <Card>
        <h2>Base URL</h2>
        <p>
          The Base URL is the address of your Atomic Serve server. If you create something new, this is where the commit will be sent to.
        </p>
        <FieldStyled>
          <LabelStyled>Base URL</LabelStyled>
          <InputWrapper>
            <InputStyled value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
          </InputWrapper>
        </FieldStyled>
        <ErrMessage>{baseUrlErr}</ErrMessage>
        <ButtonMargin onClick={handleSetBaseUrl}>save base URL</ButtonMargin>
      </Card>
    </ContainerNarrow>
  );
};

export default Settings;

const MainColorPicker = () => {
  const [color, setColor] = useLocalStorage(localStoreKeyMainColor, '#aabbcc');

  function handleSetColor(color: string) {
    setColor(color);
    window.location.reload();
  }

  return <HexColorPicker color={color} onChange={handleSetColor} />;
};
