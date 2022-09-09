import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';
import { HexColorPicker } from 'react-colorful';
import { Button } from '../components/Button';
import { LabelStyled } from '../components/forms/InputStyles';
import { useSettings } from '../helpers/AppSettings';
import { NavStyleButton } from '../components/NavStyleButton';
import { DarkModeOption } from '../helpers/useDarkMode';
import { Row } from '../components/Row';

export const SettingsTheme: React.FunctionComponent = () => {
  const { darkModeSetting, setDarkMode } = useSettings();

  return (
    <ContainerNarrow>
      <h1>Theme Settings</h1>
      <Row direction='column'>
        <LabelStyled>Dark mode</LabelStyled>
        <Row>
          <Button
            subtle={!(darkModeSetting === DarkModeOption.auto)}
            onClick={() => setDarkMode(undefined)}
            title="Use the browser's / OS dark mode settings"
          >
            🌓 auto
          </Button>
          <Button
            subtle={!(darkModeSetting === DarkModeOption.always)}
            onClick={() => setDarkMode(true)}
          >
            🌑 on
          </Button>
          <Button
            subtle={!(darkModeSetting === DarkModeOption.never)}
            onClick={() => setDarkMode(false)}
          >
            🌕 off
          </Button>
        </Row>
        <LabelStyled>Navigation bar position</LabelStyled>
        <Row>
          <NavStyleButton floating={true} top={false} title='Floating' />
          <NavStyleButton floating={false} top={false} title='Bottom' />
          <NavStyleButton floating={false} top={true} title='Top' />
        </Row>
        <LabelStyled>Main color</LabelStyled>
        <MainColorPicker />
      </Row>
      <br />
    </ContainerNarrow>
  );
};

const MainColorPicker = () => {
  const { mainColor, setMainColor } = useSettings();

  return (
    <HexColorPicker color={mainColor} onChange={val => setMainColor(val)} />
  );
};
