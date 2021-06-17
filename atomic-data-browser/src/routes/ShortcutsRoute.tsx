import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';

/** List of all the keyboard shorcuts */
export const Shortcuts: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <h1>Keyboard shortcuts</h1>
      <p>
        <code>/</code> search
      </p>
      <p>
        <code>\</code> show or hide the sidebar
      </p>
      <p>
        <code>?</code> show these keyboard shortcuts
      </p>
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
        <code>n</code> <b>n</b>ew resource
      </p>
      <p>
        <code>m</code> open <b>m</b>enu
      </p>
      <p>
        <code>s</code> go to <b>s</b>ettings
      </p>
      <p>
        <code>v</code> toggle <b>v</b>iew (collections only)
      </p>
    </ContainerNarrow>
  );
};
