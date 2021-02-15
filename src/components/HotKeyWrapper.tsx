import * as React from 'react';
import { dataURL, editURL, getSubjectFromDom } from '../helpers/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHistory } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

/** App-wide keyboard events handler */
function HotKeysWrapper({ children }: Props): JSX.Element {
  const history = useHistory();
  useHotkeys('e', () => {
    const found = getSubjectFromDom();
    found && history.push(editURL(found));
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

  return <>{children}</>;
}

export default HotKeysWrapper;
