import { Dispatch, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { localStoreKeyDarkMode } from './AppSettings';

/** A hook for using dark mode. Sets using local storage. */
// TODO: use context for this, so a refresh is not needed after changing the value.
export const useDarkMode = (): [boolean, Dispatch<boolean>] => {
  let def = false;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    def = true;
  }
  const [dark, setDark] = useState(def);
  const [darkLocal, setDarkLocal] = useLocalStorage(localStoreKeyDarkMode, dark);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setDark(e.matches ? true : false);
  });

  function setDarkBoth(a: boolean) {
    setDark(a);
    setDarkLocal(a);
  }

  useEffect(() => {
    if (darkLocal !== undefined) {
      setDark(darkLocal);
    }
  }, [dark, darkLocal]);

  return [dark, setDarkBoth];
};
