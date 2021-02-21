import React, { ReactNode } from 'react';
import { useContext } from 'react';
import { useDarkMode } from './useDarkMode';
import { useLocalStorage } from './useLocalStorage';

export const localStoreKeyMainColor = 'mainColor';
export const localStoreKeyDarkMode = 'darkMode';
export const defaultColor = '#1b50d8';

interface ProviderProps {
  children: ReactNode;
}

// Create a provider for components to consume and subscribe to changes
export const AppSettingsContextProvider = (props: ProviderProps): JSX.Element => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [mainColor, setMainColor] = useLocalStorage(localStoreKeyMainColor, defaultColor);

  return <SettingsContext.Provider value={{ darkMode, setDarkMode, mainColor, setMainColor }}>{props.children}</SettingsContext.Provider>;
};

interface AppSettings {
  // Whether the App should render in dark mode. Checks user preferences.
  darkMode: boolean;
  setDarkMode: (b: boolean) => void;
  // CSS value for the primary color
  mainColor: string;
  setMainColor: (s: string) => void;
}

/** Hook for using App Settings, such as theme and darkmode */
export const useSettings = (): AppSettings => {
  const settings = useContext(SettingsContext);
  return settings;
};

/** The context must be provided by wrapping a high level React element in <SettingsContext.Provider value={new AppSettings}> */
export const SettingsContext = React.createContext<AppSettings>(null);
