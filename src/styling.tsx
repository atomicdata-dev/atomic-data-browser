import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { darken, lighten } from 'polished';

export const localStoreKeyMainColor = 'mainColor';
export const localStoreKeyDarkMode = 'darkMode';
export const defaultColor = '#1E43A3';

/** Construct a StyledComponents theme object */
export const buildTheme = (darkMode: boolean, mainIn: string): DefaultTheme => {
  const main = darkMode ? lighten(0.2, mainIn) : mainIn;
  const bg = darkMode ? 'black' : 'white';
  const text = darkMode ? 'white' : 'black';
  const shadowColor = darkMode ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,0.1)';
  const shadowColorIntense = darkMode ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,0.3)';

  return {
    darkMode,
    fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: `2px 2px 22px 0px ${shadowColor}`,
    boxShadowIntense: `2px 2px 22px 0px ${shadowColorIntense}`,
    margin: 1,
    radius: '9px',
    colors: {
      main,
      mainLight: darkMode ? lighten(0.08)(main) : lighten(0.08)(main),
      mainDark: darkMode ? darken(0.08)(main) : darken(0.08)(main),
      bg,
      bg1: darkMode ? lighten(0.1)(bg) : darken(0.05)(bg),
      bg2: darkMode ? lighten(0.2)(bg) : darken(0.2)(bg),
      text,
      text1: darkMode ? darken(0.1)(text) : lighten(0.1)(text),
      alert: '#cf5b5b',
    },
  };
};

// Styled-components requires overwriting the default theme
import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    /** If true, make things dark */
    darkMode: boolean;
    fontFamily: string;
    boxShadow: string;
    boxShadowIntense: string;
    /** Base margin */
    margin: number;
    /** Roundness of some elements / Border radius */
    radius: string;
    /** All theme colors */
    colors: {
      /** Main accent color, used for links */
      main: string;
      mainLight: string;
      mainDark: string;
      /** Absolute background color */
      bg: string;
      /** Subtle background color */
      bg1: string;
      /** Subtle background color */
      bg2: string;
      /** Main (body) text color */
      text: string;
      /** Sublty different hue of the main text color */
      text1: string;
      /** Error / warning color */
      alert: string;
    };
  }
}

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fontFamily};
    line-height: 1.5em;
    word-wrap: break-word;
  }

  a {
    color: ${props => props.theme.colors.main};
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  h1,h2,h3,h4,h5,h6 {
    margin-bottom: ${props => props.theme.margin}rem;
    font-weight: bold;
    line-height: 1em;
    margin-top: 0;
  }

  i {
    font-style: italic;
  }

  p {
    margin-bottom: ${props => props.theme.margin}rem;
  }

  ul {
    margin-top: 0;
    margin-bottom: ${props => props.theme.margin}rem;

    li {
      list-style-type: disc;
      margin-left: ${props => props.theme.margin * 2}rem;
      margin-bottom: ${props => props.theme.margin / 2}rem;
    }
  }

  code {
    background-color: ${props => props.theme.colors.bg1};
    padding: 0rem 0.2rem;
    font-family: Monaco, monospace;
    font-size: .8rem;
    display: inline-flex;
    white-space: nowrap;
    overflow: auto;
    max-width: 100%;
  }

  b {
    font-weight: bold;
  }
`;
