import * as React from 'react';
import { dataURL, editURL, getSubjectFromDom } from '../helpers/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { isValidURL } from '../atomic-lib/client';
import { useSettings } from '../helpers/AppSettings';

type Props = {
  children: React.ReactNode;
};

/** App-wide keyboard events handler. */
// Keep changes in sync with ShortcutsRoute.tsx
function HotKeysWrapper({ children }: Props): JSX.Element {
  const history = useHistory();
  const [subject] = useCurrentSubject();
  const { sideBarLocked, setSideBarLocked } = useSettings();

  useHotkeys('e', () => {
    const found = getSubjectFromDom();
    if (found) {
      history.push(editURL(found));
    } else if (subject) {
      isValidURL(subject) && history.push(editURL(subject));
    }
  });
  useHotkeys('d', () => {
    const found = getSubjectFromDom();
    found && history.push(dataURL(found));
  });
  useHotkeys('h', () => {
    history.push('/');
  });
  useHotkeys('n', () => {
    history.push('/new');
  });
  useHotkeys('s', () => {
    history.push('/settings');
  });
  useHotkeys('shift+/', () => {
    history.push('/shortcuts');
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
