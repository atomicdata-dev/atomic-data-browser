import React, { ReactNode } from 'react';
import { useContext } from 'react';
import { Agent } from '@tomic/lib';
import { DarkModeOption, useDarkMode } from './useDarkMode';
import { useLocalStorage, useCurrentAgent } from '@tomic/react';

interface ProviderProps {
  children: ReactNode;
}

/** Create a provider for components to consume and subscribe to changes */
export const AppSettingsContextProvider = (
  props: ProviderProps,
): JSX.Element => {
  const [darkMode, setDarkMode, darkModeSetting] = useDarkMode();
  const [mainColor, setMainColor] = useLocalStorage('mainColor', '#1b50d8');
  const [navbarTop, setNavbarTop] = useLocalStorage('navbarTop', false);
  const [navbarFloating, setNavbarFloating] = useLocalStorage(
    'navbarFloating',
    false,
  );
  const [sideBarLocked, setSideBarLocked] = useLocalStorage(
    'sideBarOpen',
    false,
  );
  const [agent, setAgent] = useCurrentAgent();

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        darkModeSetting,
        setDarkMode,
        mainColor,
        setMainColor,
        navbarTop,
        setNavbarTop,
        navbarFloating,
        setNavbarFloating,
        sideBarLocked,
        setSideBarLocked,
        agent,
        setAgent,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
};

/** A bunch of getters and setters for client-side app settings */
interface AppSettings {
  /** Whether the App should render in dark mode. Checks user preferences. */
  darkMode: boolean;
  /** 'always', 'never' or 'auto' */
  darkModeSetting: DarkModeOption;
  /** When calling this with undefined (no arguments), it uses the browser's preference */
  setDarkMode: (b?: boolean) => void;
  /** CSS value for the primary color */
  mainColor: string;
  setMainColor: (s: string) => void;
  /** If the navbar should be at the top of the page */
  navbarTop: boolean;
  setNavbarTop: (s: boolean) => void;
  /** If the navbar should be floating instead of being fixed at the top or bottom */
  navbarFloating: boolean;
  setNavbarFloating: (s: boolean) => void;
  /** If the Sidebar should be locked to the side */
  sideBarLocked: boolean;
  setSideBarLocked: (s: boolean) => void;
  /** The currently signed in Agent */
  agent: Agent | null;
  setAgent: (a: Agent | null) => void;
}

/** Hook for using App Settings, such as theme and darkmode */
export const useSettings = (): AppSettings => {
  const settings = useContext(SettingsContext);
  return settings;
};

/**
 * The context must be provided by wrapping a high level React element in
 * <SettingsContext.Provider value={new AppSettings}>
 */
export const SettingsContext = React.createContext<AppSettings>(null);
