import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';
import { HexColorPicker } from 'react-colorful';
import { Button } from '../components/Button';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/InputStyles';
import { useStore } from '../atomic-react/hooks';
import { useState } from 'react';
import { Agent } from '../atomic-lib/agent';
import { Card } from '../components/Card';
import { useSettings } from '../helpers/AppSettings';

const Settings: React.FunctionComponent = () => {
  const store = useStore();
  const { darkMode, setDarkMode, navbarTop, setNavbarTop, navbarFloating, setNavbarFloating } = useSettings();
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
        <h2>Look & feel</h2>
        <Button onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'turn off' : 'turn on'} dark mode</Button>
        {!navbarFloating && <Button onClick={() => setNavbarTop(!navbarTop)}>navbar to {navbarTop ? 'bottom' : 'top'}</Button>}
        {!navbarTop && <Button onClick={() => setNavbarFloating(!navbarFloating)}>{navbarFloating ? 'fixed' : 'floating'} navbar</Button>}
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
        <Button onClick={handleSetAgent}>save agent</Button>
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
        <Button onClick={handleSetBaseUrl}>save base URL</Button>
      </Card>
    </ContainerNarrow>
  );
};

export default Settings;

const MainColorPicker = () => {
  const { mainColor, setMainColor } = useSettings();

  return <HexColorPicker color={mainColor} onChange={val => setMainColor(val)} />;
};
