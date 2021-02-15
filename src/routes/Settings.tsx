import * as React from 'react';
import { Container } from '../components/Containers';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { localStoreKeyMainColor } from '../styling';
import { ButtonMargin } from '../components/Button';
import { useDarkMode } from '../helpers/useDarkMode';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/Field';
import { useStore } from '../atomic-react/hooks';
import { useState } from 'react';
import { Agent } from '../atomic-lib/agent';

const Settings: React.FunctionComponent = () => {
  const [dark, setDark] = useDarkMode();
  const store = useStore();
  const initialAgent = store.getAgent();
  const [agentSubject, setCurrentAgent] = useState<string>(initialAgent.subject);
  const [privateKey, setCurrentPrivateKey] = useState<string>(initialAgent.privateKey);
  const [baseUrl, setBaseUrl] = useState<string>(store.getBaseUrl());
  const [agentErr, setErrAgent] = useState<Error>(null);
  const [baseUrlErr, setErrBaseUrl] = useState<Error>(null);

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
    <Container>
      <h1>Settings</h1>
      <p>Press save to apply settings.</p>
      <ButtonMargin onClick={handleSetDark}>{dark ? <FaToggleOn /> : <FaToggleOff />} dark mode</ButtonMargin>
      <p>Set the theme color:</p>
      <MainColorPicker />
      <br />
      <ButtonMargin onClick={() => window.location.reload()}>save theme</ButtonMargin>
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
      </FieldStyled>
      <ErrMessage>{agentErr}</ErrMessage>
      <ButtonMargin onClick={handleSetAgent}>save agent</ButtonMargin>
      <FieldStyled>
        <LabelStyled>Base URL</LabelStyled>
        <InputWrapper>
          <InputStyled value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
        </InputWrapper>
      </FieldStyled>
      <ErrMessage>{baseUrlErr}</ErrMessage>
      <ButtonMargin onClick={handleSetBaseUrl}>save base URL</ButtonMargin>
    </Container>
  );
};

export default Settings;

const MainColorPicker = () => {
  const [color, setColor] = useLocalStorage(localStoreKeyMainColor, '#aabbcc');
  return <HexColorPicker color={color} onChange={setColor} />;
};
