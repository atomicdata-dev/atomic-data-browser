import * as React from 'react';
import { Container } from './Containers';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { localStoreKeyMainColor } from '../styling';
import { ButtonMargin } from './Button';
import { useDarkMode } from '../helpers/useDarkMode';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from './forms/Field';
import { useStore } from '../atomic-react/hooks';
import { useState } from 'react';
import { Agent } from '../atomic-lib/agent';

const Settings: React.FunctionComponent = () => {
  const [dark, setDark] = useDarkMode();
  const store = useStore();
  const initialAgent = store.getAgent();
  const [agentSubject, setCurrentAgent] = useState<string>(initialAgent.subject);
  const [privateKey, setCurrentPrivateKey] = useState<string>(initialAgent.privateKey);
  const [err, setErr] = useState<Error>(null);

  function handleSetAgent() {
    try {
      const agent = new Agent(agentSubject, privateKey);
      store.setAgent(agent);
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <Container>
      <h1>Settings</h1>
      <p>Press save to apply settings.</p>
      <ButtonMargin onClick={() => setDark(!dark)}>{dark ? <FaToggleOn /> : <FaToggleOff />} dark mode</ButtonMargin>
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
      <ErrMessage>{err}</ErrMessage>
      <ButtonMargin onClick={handleSetAgent}>save agent</ButtonMargin>
    </Container>
  );
};

export default Settings;

const MainColorPicker = () => {
  const [color, setColor] = useLocalStorage(localStoreKeyMainColor, '#aabbcc');
  return <HexColorPicker color={color} onChange={setColor} />;
};
