import { Dispatch, useEffect, useState } from 'react';
import { useLocalStorage } from '@tomic/react';

/** A hook for using dark mode. Sets using local storage. The second argument can be called with true, false or undefined (which uses the OS default) */
export const useDarkMode = (): [boolean, Dispatch<boolean | undefined>] => {
  let def = false;
  if (checkPrefersDark()) {
    def = true;
  }
  const [dark, setDark] = useState(def);
  const [darkLocal, setDarkLocal] = useLocalStorage('darkMode', 'auto');

  // Is called when user changes color scheme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setDarkBoth(e.matches ? true : false);
  });

  /** True, false or auto (if undefined) */
  function setDarkBoth(a?: boolean) {
    if (a == undefined) {
      setDark(checkPrefersDark());
      setDarkLocal('auto');
    } else if (a == true) {
      setDark(a);
      setDarkLocal('always');
    } else if (a == false) {
      setDark(a);
      setDarkLocal('never');
    }
  }

  useEffect(() => {
    if (darkLocal == 'auto') {
      setDark(checkPrefersDark());
    } else if (darkLocal == 'always') {
      setDark(true);
    } else if (darkLocal == 'never') {
      setDark(false);
    }
  }, [darkLocal]);

  return [dark, setDarkBoth];
};

function checkPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
