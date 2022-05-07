import * as React from 'react';
import styled from 'styled-components';
import { ContainerNarrow } from '../components/Containers';
import { shortcuts } from '../components/HotKeyWrapper';

/** List of all the keyboard shorcuts */
export const Shortcuts: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <h1>Keyboard shortcuts</h1>
      <h3>Global</h3>
      <p>
        <Key>{shortcuts.search}</Key> search
      </p>
      <p>
        <Key>{shortcuts.sidebarToggle}</Key> show or hide the sidebar
      </p>
      <p>
        <Key>?</Key> show these keyboard shortcuts
      </p>
      <p>
        <Key>{shortcuts.edit}</Key> <b>e</b>dit resource
      </p>
      <p>
        <Key>{shortcuts.data}</Key> show <b>d</b>ata for resource
      </p>
      <p>
        <Key>{shortcuts.home}</Key> show <b>h</b>ome page
      </p>
      <p>
        <Key>{shortcuts.new}</Key> <b>n</b>ew resource
      </p>
      <p>
        <Key>{shortcuts.menu}</Key> open <b>m</b>enu
      </p>
      <p>
        <Key>{shortcuts.userSettings}</Key> <b>u</b>ser settings
      </p>
      <p>
        <Key>{shortcuts.themeSettings}</Key> <b>t</b>heme settings
      </p>
      <h3>Collections</h3>
      <p>
        <Key>{shortcuts.viewToggle}</Key> toggle <b>v</b>iew (table / grid)
      </p>
      <h3>Document</h3>
      <p>
        <Key>{shortcuts.moveLineUp}</Key> move line / section up
      </p>
      <p>
        <Key>{shortcuts.moveLineDown}</Key> move line / section down
      </p>
      <p>
        <Key>{shortcuts.deleteLine}</Key> delete line
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
