import * as React from 'react';
import { Container } from './Container';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { localStoreKeyMainColor } from '../styling';
import { ButtonMargin } from './Button';
import { useDarkMode } from '../helpers/useDarkMode';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const Settings: React.FunctionComponent = () => {
  const [dark, setDark] = useDarkMode();

  return (
    <Container>
      <h1>Settings</h1>
      <ButtonMargin onClick={() => setDark(!dark)}>{dark ? <FaToggleOn /> : <FaToggleOff />} dark mode</ButtonMargin>
      <p>Set the theme color:</p>
      <MainColorPicker />
      <br />
      <ButtonMargin onClick={() => window.location.reload()}>save</ButtonMargin>
    </Container>
  );
};

export default Settings;

const MainColorPicker = () => {
  const [color, setColor] = useLocalStorage(localStoreKeyMainColor, '#aabbcc');
  return <HexColorPicker color={color} onChange={setColor} />;
};
