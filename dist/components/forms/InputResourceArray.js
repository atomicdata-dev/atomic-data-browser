import React, {useState} from "../../pkg/react.js";
import {useArray} from "../../atomic-react/hooks.js";
import {ButtonMargin} from "../Button.js";
import {ErrMessage} from "./InputStyles.js";
import {ResourceSelector} from "./ResourceSelector.js";
export default function InputResourceArray({resource, property, required}) {
  const [array, setArray] = useArray(resource, property.subject);
  const [err, setErr] = useState(null);
  function handleAdd() {
    array.push(null);
    const newArray = array;
    setArray(newArray);
  }
  function handleRemove(index) {
    array.splice(index, 1);
    const newArray = array;
    setArray(newArray);
  }
  function handleSetSubject(value, handleErr, index) {
    array[index] = value;
    setArray(array, handleErr);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, array.map((subject, index) => /* @__PURE__ */ React.createElement(ResourceSelector, {
    key: `${property.subject}${index}${subject}`,
    subject,
    setSubject: (set, handleErr) => handleSetSubject(set, handleErr, index),
    error: err?.index == index && err,
    setError: setErr,
    resource,
    property,
    required,
    handleRemove: () => handleRemove(index)
  })), /* @__PURE__ */ React.createElement(ButtonMargin, {
    subtle: true,
    type: "button",
    onClick: handleAdd
  }, "add"), err?.index == void 0 && /* @__PURE__ */ React.createElement(ErrMessage, null, err?.message), array == [] && /* @__PURE__ */ React.createElement(ErrMessage, null, "Required"));
}
