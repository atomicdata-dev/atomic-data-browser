import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { darken, lighten } from 'polished';
import { useDarkMode } from './helpers/useDarkMode';

export const buildTheme = (): DefaultTheme => {
  const [darkMode] = useDarkMode();
  // const [main] = useLocalStorage('mainColor', 'rgb(150,150,255)');

  const main = darkMode ? 'rgb(150,150,255)' : 'rgb(40,40,255)';
  const bg = darkMode ? 'black' : 'white';
  const text = darkMode ? 'white' : 'black';
  const shadowColor = darkMode ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,0.1)';

  return {
    darkMode,
    fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: `2px 2px 22px 0px ${shadowColor}`,
    colors: {
      main,
      main1: darkMode ? darken(0.1)(main) : lighten(0.1)(main),
      main2: darkMode ? darken(0.2)(main) : lighten(0.2)(main),
      bg,
      bg1: darkMode ? lighten(0.1)(bg) : darken(0.1)(bg),
      bg2: darkMode ? lighten(0.2)(bg) : darken(0.2)(bg),
      text,
      text1: darkMode ? darken(0.1)(text) : lighten(0.1)(text),
      alert: 'red',
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
    /** All theme colors */
    colors: {
      /** Main accent color, used for links */
      main: string;
      /** Subtly different hue of the main color. */
      main1: string;
      /** Even more different hue of the main color. */
      main2: string;
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
  }

  h1 {
    font-size: 3rem;
    line-height: 1.3em;
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: bold;
  }

  i {
    font-style: italic;
  }

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin-bottom: 1rem;
    li {
      list-style-type: disc;
      margin-left: 2rem;
      margin-bottom: .5rem;
    }
  }

  code {
    background-color: ${props => props.theme.colors.bg1};
    padding: .5rem;
    font-family: Monaco, monospace;
    font-size: .8rem;
    display: block;
    white-space: nowrap;
    overflow: scroll;
  }

  a {
    color: ${props => props.theme.colors.main};
    text-decoration: none;
    &:hover {
      color: ${props => props.theme.colors.main1};
    }
    &:active {
      color: ${props => props.theme.colors.main2};
    }
  }
`;
