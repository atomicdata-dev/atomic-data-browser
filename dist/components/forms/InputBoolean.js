import React, {useState} from "../../pkg/react.js";
import {useBoolean} from "../../atomic-react/hooks.js";
import {ErrMessage, InputStyled} from "./InputStyles.js";
export default function InputBoolean({resource, property, required}) {
  const [value, setValue] = useBoolean(resource, property.subject);
  const [err, setErr] = useState(null);
  function handleUpdate(e) {
    setValue(e.target.checked, setErr);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputStyled, {
    type: "checkbox",
    checked: value,
    onChange: handleUpdate,
    required
  }), err && /* @__PURE__ */ React.createElement(ErrMessage, null, err.message));
}
