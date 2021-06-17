import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';
import { HexColorPicker } from 'react-colorful';
import { Button } from '../components/Button';
import { ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/InputStyles';
import { useStore } from '@tomic/react';
import { useState } from 'react';
import { Card } from '../components/Card';
import { useSettings } from '../helpers/AppSettings';
import { NavStyleButton } from '../components/NavStyleButton';
import SettingsAgent from '../components/SettingsAgent';

const Settings: React.FunctionComponent = () => {
  const store = useStore();
  const { darkMode, setDarkMode } = useSettings();
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
    <ContainerNarrow>
      <h1>Settings</h1>
      <Card>
        <h2>Look and feel</h2>
        <Button onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'disable' : 'enable'} dark mode</Button>
        <LabelStyled>Navigation bar position</LabelStyled>
        <NavStyleButton floating={true} top={false} title='Floating' />
        <NavStyleButton floating={false} top={false} title='Bottom' />
        <NavStyleButton floating={false} top={true} title='Top' />
        <LabelStyled>Main color</LabelStyled>
        <MainColorPicker />
        <br />
      </Card>
      <SettingsAgent />
      <Card>
        <h2>Base URL</h2>
        <p>The Base URL is the address of your Atomic Server. If you create something new, this is where the commit will be sent to.</p>
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
