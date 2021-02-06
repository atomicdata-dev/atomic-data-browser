import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useDarkMode = (): [boolean, Dispatch<SetStateAction<boolean>>] => {
  let def = false;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    def = true;
  }
  const [dark, setDark] = useState(def);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setDark(e.matches ? true : false);
    console.log('SWITCH', e);
  });

  const toggleTheme = () => {
    if (dark === true) {
      setDark(false);
    } else {
      setDark(true);
    }
  };

  useEffect(() => {
    // const localMode = localStorage.getItem('theme');
    // if (localMode) {
    //   setDark(localMode);
    // }
  }, []);

  return [dark, toggleTheme];
};
