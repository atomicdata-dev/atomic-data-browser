import * as React from "../pkg/react.js";
import {FaHome, FaPlus, FaArrowLeft, FaArrowRight} from "../pkg/react-icons/fa.js";
import {useHistory} from "../pkg/react-router-dom.js";
import styled from "../pkg/styled-components.js";
import {openURL} from "../helpers/navigation.js";
import {useFocus} from "../helpers/useFocus.js";
import {ButtonBar} from "./Button.js";
import {useHotkeys} from "../pkg/react-hotkeys-hook.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
export function AddressBar() {
  const [subject, setSubject] = useCurrentSubject();
  const history = useHistory();
  const [inputRef, setInputFocus] = useFocus();
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
  return /* @__PURE__ */ React.createElement(AddressBarStyled, {
    onSubmit: handleSubmit
  }, /* @__PURE__ */ React.createElement(ButtonBar, {
    type: "button",
    onClick: () => handleNavigation("/"),
    title: "Home"
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
    title: "Create a new Resource",
    onClick: () => handleNavigation("/new")
  }, /* @__PURE__ */ React.createElement(FaPlus, null)));
}
const AddressBarStyled = styled.form`
  box-shadow: ${(props) => props.theme.boxShadow};
  position: fixed;
  z-index: 100;
  bottom: 2rem;
  height: 2rem;
  display: flex;
  border: solid 1px ${(props) => props.theme.colors.main};
  border-radius: 999px;
  overflow: hidden;
  max-width: calc(100% - 2rem);
  width: 40rem;
  margin: auto;
  /* Center fixed item */
  left: 50%;
  margin-left: -20rem; /* Negative half of width. */
  margin-right: -20rem; /* Negative half of width. */
  background-color: ${(props) => props.theme.colors.bg1};
  &:hover {
    border-color: ${(props) => props.theme.colors.mainLight};
  }

  @media (max-width: 40rem) {
    max-width: calc(100% - 1rem);
    left: auto;
    right: auto;
    margin-left: 0.5rem;
    bottom: 0.5rem;
  }

  /* Search bar and buttons */
  input {
    border: none;
    font-size: 0.8rem;
    padding: 0.4rem 1.2rem;
    color: ${(props) => props.theme.colors.text};
  }

  /* Search bar */
  input[type='text'] {
    flex: 1;
    min-width: 1rem;
    background-color: ${(props) => props.theme.colors.bg};
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
