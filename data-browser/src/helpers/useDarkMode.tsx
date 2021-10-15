import { Dispatch, useEffect, useState } from 'react';
import { useLocalStorage } from '@tomic/react';

export enum DarkModeOption {
  /** Always use dark mode */
  always = 'always',
  /** Never use dark mode, always light */
  never = 'never',
  /** Use OS / Browser setting */
  auto = 'auto',
}

/**
 * A hook for using dark mode. Sets using local storage. The second argument can
 * be called with true, false or undefined (which uses the OS default)
 */
export const useDarkMode = (): [
  boolean,
  Dispatch<boolean | undefined>,
  DarkModeOption,
] => {
  let def = false;
  if (checkPrefersDark()) {
    def = true;
  }
  const [dark, setDark] = useState(def);
  const [darkLocal, setDarkLocal] = useLocalStorage<DarkModeOption>(
    'darkMode',
    DarkModeOption.auto,
  );

  // Is called when user changes color scheme
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      setDarkBoth(e.matches ? true : false);
    });

  /** True, false or auto (if undefined) */
  function setDarkBoth(a?: boolean) {
    if (a == undefined) {
      setDark(checkPrefersDark());
      setDarkLocal(DarkModeOption.auto);
    } else if (a == true) {
      setDark(a);
      setDarkLocal(DarkModeOption.always);
    } else if (a == false) {
      setDark(a);
      setDarkLocal(DarkModeOption.never);
    }
  }

  useEffect(() => {
    if (darkLocal == DarkModeOption.auto) {
      setDark(checkPrefersDark());
    } else if (darkLocal == DarkModeOption.always) {
      setDark(true);
    } else if (darkLocal == DarkModeOption.never) {
      setDark(false);
    }
  }, [darkLocal]);

  return [dark, setDarkBoth, darkLocal];
};

function checkPrefersDark() {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}
