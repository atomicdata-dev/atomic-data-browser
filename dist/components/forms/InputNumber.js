import React, {useState} from "../../pkg/react.js";
import {useNumber} from "../../atomic-react/hooks.js";
import {ErrMessage, InputStyled, InputWrapper} from "./InputStyles.js";
export default function InputNumber({resource, property, required}) {
  const [value, setValue] = useNumber(resource, property.subject);
  const [err, setErr] = useState(null);
  function handleUpdate(e) {
    if (e.target.value == "") {
      setValue(null);
      return;
    }
    const newval = +e.target.value;
    setValue(newval, setErr);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, {
    placeholder: "Enter a number...",
    type: "number",
    value: value == null ? NaN : value,
    onChange: handleUpdate,
    required
  })), value !== null && err && /* @__PURE__ */ React.createElement(ErrMessage, null, err.message), value == null && /* @__PURE__ */ React.createElement(ErrMessage, null, "Required"));
}
