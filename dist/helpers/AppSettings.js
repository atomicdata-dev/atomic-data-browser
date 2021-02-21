import React from "../pkg/react.js";
import {useContext} from "../pkg/react.js";
import {useDarkMode} from "./useDarkMode.js";
import {useLocalStorage} from "./useLocalStorage.js";
export const localStoreKeyMainColor = "mainColor";
export const localStoreKeyDarkMode = "darkMode";
export const defaultColor = "#1b50d8";
export const AppSettingsContextProvider = (props) => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [mainColor, setMainColor] = useLocalStorage(localStoreKeyMainColor, defaultColor);
  return /* @__PURE__ */ React.createElement(SettingsContext.Provider, {
    value: {darkMode, setDarkMode, mainColor, setMainColor}
  }, props.children);
};
export const useSettings = () => {
  const settings = useContext(SettingsContext);
  return settings;
};
export const SettingsContext = React.createContext(null);
