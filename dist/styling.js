import {createGlobalStyle} from "./pkg/styled-components.js";
import {darken, lighten} from "./pkg/polished.js";
import {useDarkMode} from "./helpers/useDarkMode.js";
export const buildTheme = () => {
  const [darkMode] = useDarkMode();
  const main = darkMode ? "rgb(150,150,255)" : "rgb(40,40,255)";
  const bg = darkMode ? "black" : "white";
  return {
    darkMode,
    fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    colors: {
      main,
      main1: darkMode ? darken(0.1)(main) : lighten(0.1)(main),
      main2: darkMode ? darken(0.2)(main) : lighten(0.2)(main),
      bg,
      bg1: darkMode ? lighten(0.1)(bg) : darken(0.1)(bg),
      text: darkMode ? "white" : "black",
      alert: "red"
    }
  };
};
import "./pkg/styled-components.js";
export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.fontFamily};
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
    color: ${(props) => props.theme.colors.main};
    text-decoration: none;
    &:hover {
      color: ${(props) => props.theme.colors.main1};
    }
    &:active {
      color: ${(props) => props.theme.colors.main2};
    }
  }
`;
