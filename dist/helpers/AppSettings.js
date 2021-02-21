import React from "../pkg/react.js";
import {useContext} from "../pkg/react.js";
import {useDarkMode} from "./useDarkMode.js";
import {useLocalStorage} from "./useLocalStorage.js";
export const AppSettingsContextProvider = (props) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [mainColor, setMainColor] = useLocalStorage("mainColor", "#1b50d8");
  const [navbarTop, setNavbarTop] = useLocalStorage("navbarTop", false);
  const [navbarFloating, setNavbarFloating] = useLocalStorage("navbarFloating", false);
  return /* @__PURE__ */ React.createElement(SettingsContext.Provider, {
    value: {darkMode, setDarkMode, mainColor, setMainColor, navbarTop, setNavbarTop, navbarFloating, setNavbarFloating}
  }, props.children);
};
export const useSettings = () => {
  const settings = useContext(SettingsContext);
  return settings;
};
export const SettingsContext = React.createContext(null);
