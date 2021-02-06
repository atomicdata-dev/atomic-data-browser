import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { lighten } from 'polished';

export const buildTheme = (darkMode: boolean): DefaultTheme => {
  return {
    darkMode,
    fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    colors: {
      main: darkMode ? 'rgb(150,150,255)' : 'rgb(40,40,255)',
      mainAlt: darkMode ? 'rgb(155,155,255)' : 'rgb(35,35,255)',
      bg1: '#ececec',
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
    /** All theme colors */
    colors: {
      /** Main accent color, used for links */
      main: string;
      /** Subtly different hue of the main color. */
      mainAlt: string;
      /** Subtle background color */
      bg1: string;
    };
  }
}

export const GlobalStyle = createGlobalStyle`
  body {
    color: ${props => (props.theme.darkMode ? 'white' : 'black')};
    background-color: ${props => (props.theme.darkMode ? 'black' : 'white')};
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

  a {
    color: ${props => props.theme.colors.main};
    text-decoration: none;
  }

  a:hover {
    color: ${props => lighten(0.1, props.theme.colors.main)};
  }
`;
