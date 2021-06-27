import * as React from "../pkg/react.js";
import {Button} from "../components/Button.js";
import {ErrMessage, FieldStyled, InputStyled, InputWrapper, LabelStyled} from "../components/forms/InputStyles.js";
import {useState} from "../pkg/react.js";
import {useStore} from "../link/react/src/index.js";
export function SettingsBaseUrl() {
  const store = useStore();
  const [baseUrl, setBaseUrl] = useState(store.getBaseUrl());
  const [baseUrlErr, setErrBaseUrl] = useState(null);
  function handleSetBaseUrl() {
    try {
      store.setBaseUrl(baseUrl);
    } catch (e) {
      setErrBaseUrl(e);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "Base URL"), /* @__PURE__ */ React.createElement("p", null, "The Base URL is the address of your Atomic Server. If you create something new, this is where the commit will be sent to."), /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelStyled, null, "Base URL"), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, {
    value: baseUrl,
    onChange: (e) => setBaseUrl(e.target.value)
  }))), /* @__PURE__ */ React.createElement(ErrMessage, null, baseUrlErr), /* @__PURE__ */ React.createElement(Button, {
    onClick: handleSetBaseUrl
  }, "save base URL"));
}
