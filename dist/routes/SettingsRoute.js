import * as React from "../pkg/react.js";
import {ContainerNarrow} from "../components/Containers.js";
import {HexColorPicker} from "../pkg/react-colorful.js";
import "../pkg/react-colorful/dist/index.css.proxy.js";
import {ButtonMargin} from "../components/Button.js";
import {ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled} from "../components/forms/InputStyles.js";
import {useStore} from "../atomic-react/hooks.js";
import {useState} from "../pkg/react.js";
import {Agent} from "../atomic-lib/agent.js";
import {Card} from "../components/Card.js";
import {useSettings} from "../helpers/AppSettings.js";
const Settings = () => {
  const store = useStore();
  const {darkMode, setDarkMode, navbarTop, setNavbarTop, navbarFloating, setNavbarFloating} = useSettings();
  const [agentSubject, setCurrentAgent] = useState(null);
  const [privateKey, setCurrentPrivateKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(store.getBaseUrl());
  const [agentErr, setErrAgent] = useState(null);
  const [baseUrlErr, setErrBaseUrl] = useState(null);
  if (agentSubject == null)
    try {
      setCurrentAgent(store.getAgent().subject);
      setCurrentPrivateKey(store.getAgent().privateKey);
    } catch (err) {
      setCurrentAgent("");
    }
  function handleSetAgent() {
    try {
      const agent = new Agent(agentSubject, privateKey);
      store.setAgent(agent);
    } catch (e) {
      setErrAgent(e);
    }
  }
  function handleSetBaseUrl() {
    try {
      store.setBaseUrl(baseUrl);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, null, /* @__PURE__ */ React.createElement("h1", null, "Settings"), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("h2", null, "Look & feel"), /* @__PURE__ */ React.createElement(ButtonMargin, {
    onClick: () => setDarkMode(!darkMode)
  }, darkMode ? "turn off" : "turn on", " dark mode"), !navbarFloating && /* @__PURE__ */ React.createElement(ButtonMargin, {
    onClick: () => setNavbarTop(!navbarTop)
  }, "navbar to ", navbarTop ? "bottom" : "top"), !navbarTop && /* @__PURE__ */ React.createElement(ButtonMargin, {
    onClick: () => setNavbarFloating(!navbarFloating)
  }, navbarFloating ? "fixed" : "floating", " navbar"), /* @__PURE__ */ React.createElement(MainColorPicker, null), /* @__PURE__ */ React.createElement("br", null)), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("h2", null, "Agent"), /* @__PURE__ */ React.createElement("p", null, "An Agent is a user, consisting of a Subject (its URL) and Private Key. Together, these can be used to edit data and sign Commits. Creating an Agent currently requires setting up an ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic/tree/master/server"
  }, "atomic-server"), "."), /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelStyled, null, "Agent Subject URL"), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, {
    value: agentSubject,
    onChange: (e) => setCurrentAgent(e.target.value)
  }))), /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelStyled, null, "Private Key"), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, {
    value: privateKey,
    onChange: (e) => setCurrentPrivateKey(e.target.value)
  })), /* @__PURE__ */ React.createElement(ErrMessage, null, agentErr?.message)), /* @__PURE__ */ React.createElement(ButtonMargin, {
    onClick: handleSetAgent
  }, "save agent")), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("h2", null, "Base URL"), /* @__PURE__ */ React.createElement("p", null, "The Base URL is the address of your Atomic Serve server. If you create something new, this is where the commit will be sent to."), /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelStyled, null, "Base URL"), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, {
    value: baseUrl,
    onChange: (e) => setBaseUrl(e.target.value)
  }))), /* @__PURE__ */ React.createElement(ErrMessage, null, baseUrlErr), /* @__PURE__ */ React.createElement(ButtonMargin, {
    onClick: handleSetBaseUrl
  }, "save base URL")));
};
export default Settings;
const MainColorPicker = () => {
  const {mainColor, setMainColor} = useSettings();
  return /* @__PURE__ */ React.createElement(HexColorPicker, {
    color: mainColor,
    onChange: (val) => setMainColor(val)
  });
};
