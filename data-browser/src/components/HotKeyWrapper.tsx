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

/** List of used keyboard shortcuts, mapped for OS */
export const shortcuts = {
  edit: osKey('e'),
  data: osKey('d'),
  home: osKey('h'),
  new: osKey('n'),
  userSettings: osKey('u'),
  themeSettings: osKey('t'),
  keyboardShortcuts: 'shift+/',
  search: '\\',
  viewToggle: osKey('v'),
  menu: osKey('m'),
  sidebar: '/',
};

function osKey(key: string): string {
  return navigator.platform.includes('Mac') ? `cmd+${key}` : `ctrl+${key}`;
}

/** App-wide keyboard events handler. */
// Keep changes in sync with ShortcutsRoute.tsx
function HotKeysWrapper({ children }: Props): JSX.Element {
  const history = useHistory();
  const [subject] = useCurrentSubject();
  const { sideBarLocked, setSideBarLocked } = useSettings();

  useHotkeys(
    shortcuts.edit,
    () => {
      isValidURL(subject) && history.push(editURL(subject));
    },
    {},
    [subject],
  );
  useHotkeys(
    shortcuts.data,
    () => {
      isValidURL(subject) && history.push(dataURL(subject));
    },
    {},
    [subject],
  );
  useHotkeys(shortcuts.home, () => {
    history.push('/');
  });
  useHotkeys(shortcuts.new, () => {
    history.push(paths.new);
  });
  useHotkeys(shortcuts.userSettings, () => {
    history.push(paths.agentSettings);
  });
  useHotkeys(shortcuts.themeSettings, () => {
    history.push(paths.themeSettings);
  });
  useHotkeys(shortcuts.keyboardShortcuts, () => {
    history.push(paths.shortcuts);
  });
  useHotkeys(
    shortcuts.search,
    () => {
      setSideBarLocked(!sideBarLocked);
    },
    {},
    [sideBarLocked],
  );

  return <>{children}</>;
}

export default HotKeysWrapper;
