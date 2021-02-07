import {useEffect, useState} from "../pkg/react.js";
export const useDarkMode = () => {
  let def = false;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    def = true;
  }
  const [dark, setDark] = useState(def);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    setDark(e.matches ? true : false);
  });
  const toggleTheme = () => {
    if (dark === true) {
      setDark(false);
    } else {
      setDark(true);
    }
  };
  useEffect(() => {
  }, []);
  return [dark, toggleTheme];
};
