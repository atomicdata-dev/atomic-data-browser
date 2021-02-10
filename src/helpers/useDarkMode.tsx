import { Dispatch, useEffect, useState } from 'react';
import { localStoreKeyDarkMode } from '../styling';
import { useLocalStorage } from './useLocalStorage';

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
