import {useEffect, useState} from "../pkg/react.js";
import {useLocalStorage} from "./useLocalStorage.js";
export const useDarkMode = () => {
  let def = false;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    def = true;
  }
  const [dark, setDark] = useState(def);
  const [darkLocal, setDarkLocal] = useLocalStorage("darkMode", dark);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    setDark(e.matches ? true : false);
  });
  function setDarkBoth(a) {
    setDark(a);
    setDarkLocal(a);
  }
  useEffect(() => {
    if (darkLocal !== void 0) {
      setDark(darkLocal);
    }
  }, [dark, darkLocal]);
  return [dark, setDarkBoth];
};
