import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { lighten } from 'polished';

// Detect dark mode
const darkMode = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }

  // Watch for changes, not used
  // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  //   const newColorScheme = e.matches ? 'dark' : 'light';
  // });
};

export const theme: DefaultTheme = {
  darkMode: darkMode(),
  fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  colors: {
    main: 'rgb(150,150,255)',
  },
};

import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    /** If true, make things dark */
    darkMode: boolean;
    fontFamily: string;
    colors: {
      main: string;
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
