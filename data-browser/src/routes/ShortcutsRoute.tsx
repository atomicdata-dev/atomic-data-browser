import * as React from 'react';
import styled from 'styled-components';
import { ContainerNarrow } from '../components/Containers';

/** List of all the keyboard shorcuts */
export const Shortcuts: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <h1>Keyboard shortcuts</h1>
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
        <Key>h</Key> go <b>h</b>ome
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
      <p>
        <Key>v</Key> toggle <b>v</b>iew (collections only)
      </p>
    </ContainerNarrow>
  );
};

const Key = styled.code`
  font-size: 1rem;
  width: 1.7rem;
  height: 1.7rem;
  display: inline-flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: solid 1px ${p => p.theme.colors.bg2};
  border-radius: 5px;
  box-sizing: border-box;
  font-family: monospace;
`;
