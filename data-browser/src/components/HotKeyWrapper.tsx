import * as React from 'react';
import { dataURL, editURL } from '../helpers/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { isValidURL } from '@tomic/lib';
import { useSettings } from '../helpers/AppSettings';
import { paths } from '../routes/paths';

type Props = {
  children: React.ReactNode;
};

/** App-wide keyboard events handler. */
// Keep changes in sync with ShortcutsRoute.tsx
function HotKeysWrapper({ children }: Props): JSX.Element {
  const history = useHistory();
  const [subject] = useCurrentSubject();
  const { sideBarLocked, setSideBarLocked } = useSettings();

  useHotkeys(
    'e',
    () => {
      isValidURL(subject) && history.push(editURL(subject));
    },
    {},
    [subject],
  );
  useHotkeys(
    'd',
    () => {
      isValidURL(subject) && history.push(dataURL(subject));
    },
    {},
    [subject],
  );
  useHotkeys('h', () => {
    history.push('/');
  });
  useHotkeys('n', () => {
    history.push(paths.new);
  });
  useHotkeys('u', () => {
    history.push(paths.agentSettings);
  });
  useHotkeys('t', () => {
    history.push(paths.themeSettings);
  });
  useHotkeys('shift+/', () => {
    history.push(paths.shortcuts);
  });
  useHotkeys(
    '\\',
    () => {
      setSideBarLocked(!sideBarLocked);
    },
    {},
    [sideBarLocked],
  );

  return <>{children}</>;
}

export default HotKeysWrapper;
