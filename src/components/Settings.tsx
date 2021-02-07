import * as React from 'react';
import { Container } from './Container';

const Settings: React.FunctionComponent = () => {
  return (
    <Container>
      <h1>Settings</h1>
      <Picker />
    </Container>
  );
};

export default Settings;

import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import { useLocalStorage } from '../helpers/useLocalStorage';

const Picker = () => {
  const [color, setColor] = useLocalStorage('mainColor', '#aabbcc');
  return <HexColorPicker color={color} onChange={setColor} />;
};
