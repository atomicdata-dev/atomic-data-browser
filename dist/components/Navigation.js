import * as React from "../pkg/react.js";
import {FaHome, FaPlus, FaArrowLeft, FaArrowRight} from "../pkg/react-icons/fa.js";
import {useHistory} from "../pkg/react-router-dom.js";
import styled from "../pkg/styled-components.js";
import {openURL} from "../helpers/navigation.js";
import {useFocus} from "../helpers/useFocus.js";
import {ButtonBar} from "./Button.js";
import {useHotkeys} from "../pkg/react-hotkeys-hook.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
import {useSettings} from "../helpers/AppSettings.js";
import {transparentize} from "../pkg/polished.js";
export function Navigation({children}) {
  const {navbarTop} = useSettings();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, navbarTop && /* @__PURE__ */ React.createElement(NavBar, null), /* @__PURE__ */ React.createElement(Content, {
    topPadding: navbarTop
  }, children), !navbarTop && /* @__PURE__ */ React.createElement(NavBar, null));
}
const Content = styled.div`
  margin-top: ${(props) => props.topPadding ? "2rem" : "0"};
  margin-bottom: ${(props) => props.topPadding ? "0" : "2rem"};
`;
function NavBar() {
  const [subject, setSubject] = useCurrentSubject();
  const history = useHistory();
  const [inputRef, setInputFocus] = useFocus();
  const {navbarTop, navbarFloating} = useSettings();
  useHotkeys("/", (e) => {
    e.preventDefault();
    history.push("/");
    inputRef.current.select();
  });
  useHotkeys("esc", (e) => {
    e.preventDefault();
    console.log("esc");
    inputRef.current.blur();
  }, {enableOnTags: ["INPUT"]});
  useHotkeys("/", (e) => {
    e.preventDefault();
    setSubject[""];
    setInputFocus();
  });
  function handleChange(e) {
    handleNavigation(openURL(e.target.value));
  }
  function handleSelect(e) {
    e.target.select();
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    inputRef.current.blur();
    document.activeElement.blur();
    handleNavigation(openURL(subject));
  };
  const handleNavigation = (to) => {
    history.push(to);
  };
  const ConditionalNavbar = navbarFloating ? NavBarFloating : NavBarFixed;
  return /* @__PURE__ */ React.createElement(ConditionalNavbar, {
    top: navbarTop,
    floating: navbarFloating,
    onSubmit: handleSubmit
  }, /* @__PURE__ */ React.createElement(ButtonBar, {
    type: "button",
    onClick: () => handleNavigation("/"),
    title: "Go home (h)"
  }, /* @__PURE__ */ React.createElement(FaHome, null)), /* @__PURE__ */ React.createElement(ButtonBar, {
    type: "button",
    title: "Go back",
    onClick: history.goBack
  }, /* @__PURE__ */ React.createElement(FaArrowLeft, null)), /* @__PURE__ */ React.createElement(ButtonBar, {
    type: "button",
    title: "Go forward",
    onClick: history.goForward
  }, /* @__PURE__ */ React.createElement(FaArrowRight, null)), /* @__PURE__ */ React.createElement("input", {
    ref: inputRef,
    type: "text",
    onClick: handleSelect,
    value: subject || "",
    onChange: handleChange,
    placeholder: 'Enter an Atomic URL or search   (press "/" )'
  }), /* @__PURE__ */ React.createElement(ButtonBar, {
    type: "button",
    title: "Create a new Resource (n)",
    onClick: () => handleNavigation("/new")
  }, /* @__PURE__ */ React.createElement(FaPlus, null)));
}
const NavBarBase = styled.form`
  position: fixed;
  z-index: 100;
  height: 2.5rem;
  display: flex;
  border: solid 1px ${(props) => props.theme.colors.bg2};
  background-color: ${(props) => props.theme.colors.bg1};

  /* Search bar and buttons */
  input {
    border: none;
    font-size: 0.9rem;
    padding: 0.4rem 1.2rem;
    color: ${(props) => props.theme.colors.text};
  }

  /* Search bar */
  input[type='text'] {
    flex: 1;
    min-width: 1rem;
    background-color: ${(props) => props.theme.colors.bg};
    outline: 0;

    &:hover {
      box-shadow: inset 0 0 0 2px ${(props) => transparentize(0.6, props.theme.colors.main)};
    }
    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px ${(props) => props.theme.colors.main};
      /* border-radius: ${(props) => props.theme.radius}; */
      box-sizing: border-box;
      /* outline-offset: -1px; */
    }
  }

  input[type='submit'] {
    background-color: ${(props) => props.theme.colors.main};
    color: white;
    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.colors.mainLight};
    }
    &:active {
      background-color: ${(props) => props.theme.colors.mainDark};
    }
  }
`;
const NavBarFloating = styled(NavBarBase)`
  box-shadow: ${(props) => props.theme.boxShadow};
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: 40rem;
  margin: auto;
  /* Center fixed item */
  left: 50%;
  margin-left: -20rem; /* Negative half of width. */
  margin-right: -20rem; /* Negative half of width. */
  position: ${(props) => props.floating ? "fixed" : "relative"};
  top: ${(props) => props.top ? "2rem" : "auto"};
  bottom: ${(props) => props.top ? "auto" : "2rem"};

  @media (max-width: 40rem) {
    max-width: calc(100% - 1rem);
    left: auto;
    right: auto;
    margin-left: 0.5rem;
    bottom: 0.5rem;
  }
`;
const NavBarFixed = styled(NavBarBase)`
  top: ${(props) => props.top ? "0" : "auto"};
  bottom: ${(props) => props.top ? "auto" : "0"};
  left: 0;
  right: 0;
  border-width: 0;
  border-bottom: ${(props) => props.top ? "solid 1px " + props.theme.colors.bg2 : "none"};
  border-top: ${(props) => !props.top ? "solid 1px " + props.theme.colors.bg2 : "none"};
`;
