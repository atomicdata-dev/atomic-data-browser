import * as React from 'react';
import styled from 'styled-components';
import { ContainerNarrow } from '../components/Containers';

/** List of all the keyboard shorcuts */
export const Shortcuts: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <h1>Keyboard shortcuts</h1>
      <h3>Global</h3>
      <p>
        <Key>/</Key> search
      </p>
      <p>
        <Key>\</Key> show or hide the sidebar
      </p>
      <p>
        <Key>?</Key> show these keyboard shortcuts
      </p>
      <p>
        <Key>e</Key> <b>e</b>dit resource
      </p>
      <p>
        <Key>d</Key> show <b>d</b>ata for resource
      </p>
      <p>
        <Key>a</Key> show <b>a</b>bout page
      </p>
      <p>
        <Key>n</Key> <b>n</b>ew resource
      </p>
      <p>
        <Key>m</Key> open <b>m</b>enu
      </p>
      <p>
        <Key>u</Key> <b>u</b>ser settings
      </p>
      <p>
        <Key>t</Key> <b>t</b>heme settings
      </p>
      <h3>Collections</h3>
      <p>
        <Key>v</Key> toggle <b>v</b>iew (table / grid)
      </p>
      <h3>Document</h3>
      <p>
        <Key>alt</Key>+<Key>up</Key> move line / section up
      </p>
      <p>
        <Key>alt</Key>+<Key>down</Key> move line / section down
      </p>
      <p>
        <Key>ctrl</Key>+<Key>backspace</Key> delete line
      </p>
    </ContainerNarrow>
  );
};

const Key = styled.code`
  font-size: 1rem;
  min-width: 1.7rem;
  height: 1.7rem;
  display: inline-flex;
  padding: 0 0.5rem;
  align-items: center;
  justify-content: center;
  border: solid 1px ${p => p.theme.colors.bg2};
  border-radius: 5px;
  box-sizing: border-box;
  font-family: monospace;
`;
