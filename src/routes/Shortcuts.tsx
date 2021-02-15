import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';

export const Shortcuts: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <h1>Keyboard shortcuts</h1>
      <p>
        <code>e</code> <b>e</b>dit resource at cursor
      </p>
      <p>
        <code>d</code> show <b>d</b>ata for resource at cursor
      </p>
      <p>
        <code>h</code> go <b>h</b>ome
      </p>
      <p>
        <code>?</code> show keyboard shortcuts
      </p>
      <p>
        <code>/</code> focus navbar
      </p>
      <p>
        <code>n</code> <b>n</b>ew resource
      </p>
    </ContainerNarrow>
  );
};
