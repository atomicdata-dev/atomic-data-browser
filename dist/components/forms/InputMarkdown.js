import React, {useState} from "../../pkg/react.js";
import {useString} from "../../atomic-react/hooks.js";
import {ErrMessage, InputWrapper, TextAreaStyled} from "./InputStyles.js";
export default function InputMarkdown({resource, property, required}) {
  const [value, setVale] = useString(resource, property.subject);
  const [err, setErr] = useState(null);
  function handleUpdate(e) {
    const newval = e.target.value;
    setVale(newval, setErr);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(TextAreaStyled, {
    rows: 3,
    value: value == null ? "" : value,
    onChange: handleUpdate,
    required
  })), value !== "" && err && /* @__PURE__ */ React.createElement(ErrMessage, null, err.message), value == "" && /* @__PURE__ */ React.createElement(ErrMessage, null, "Required"));
}
