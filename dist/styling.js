import {createGlobalStyle, ThemeProvider} from "./pkg/styled-components.js";
import {darken, lighten} from "./pkg/polished.js";
import "../reset.css.proxy.js";
import React from "./pkg/react.js";
import "./pkg/styled-components.js";
import {useContext} from "./pkg/react.js";
import {SettingsContext} from "./helpers/AppSettings.js";
export const ThemeWrapper = ({children}) => {
  const {mainColor, darkMode} = useContext(SettingsContext);
  return /* @__PURE__ */ React.createElement(ThemeProvider, {
    key: mainColor,
    theme: buildTheme(darkMode, mainColor)
  }, children);
};
export const buildTheme = (darkMode, mainIn) => {
  const main = darkMode ? lighten(0.2, mainIn) : mainIn;
  const bg = darkMode ? "black" : "white";
  const text = darkMode ? "white" : "black";
  const shadowColor = darkMode ? "rgba(255,255,255,.15)" : "rgba(0,0,0,0.1)";
  const shadowColorIntense = darkMode ? "rgba(255,255,255,.3)" : "rgba(0,0,0,0.3)";
  return {
    darkMode,
    fontFamily: "'Helvetica Neue', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: `2px 2px 22px 0px ${shadowColor}`,
    boxShadowIntense: `2px 2px 22px 0px ${shadowColorIntense}`,
    margin: 1,
    radius: "9px",
    colors: {
      main,
      mainLight: darkMode ? lighten(0.08)(main) : lighten(0.08)(main),
      mainDark: darkMode ? darken(0.08)(main) : darken(0.08)(main),
      bg,
      bg1: darkMode ? lighten(0.1)(bg) : darken(0.05)(bg),
      bg2: darkMode ? lighten(0.3)(bg) : darken(0.2)(bg),
      text,
      text1: darkMode ? darken(0.1)(text) : lighten(0.1)(text),
      alert: "#cf5b5b"
    }
  };
};
export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.bg};
    color: ${(props) => props.theme.colors.text};
    font-family: ${(props) => props.theme.fontFamily};
    line-height: 1.5em;
    word-wrap: break-word;
    transition: background-color .5s ease, color .5s ease;
  }

  a {
    color: ${(props) => props.theme.colors.main};
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  h1,h2,h3,h4,h5,h6 {
    margin-bottom: ${(props) => props.theme.margin}rem;
    font-weight: bold;
    line-height: 1em;
    margin-top: 0;
  }

  i {
    font-style: italic;
  }

  p {
    margin-top: 0;
    margin-bottom: ${(props) => props.theme.margin}rem;
  }

  ul {
    margin-top: 0;
    margin-bottom: ${(props) => props.theme.margin}rem;

    li {
      list-style-type: disc;
      margin-left: ${(props) => props.theme.margin * 2}rem;
      margin-bottom: ${(props) => props.theme.margin / 2}rem;
    }
  }

  code {
    background-color: ${(props) => props.theme.colors.bg1};
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
