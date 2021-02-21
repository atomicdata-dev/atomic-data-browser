import React, {useState} from "../../pkg/react.js";
import {useString} from "../../atomic-react/hooks.js";
import {ResourceSelector} from "./ResourceSelector.js";
export function InputResource({resource, property, required}) {
  const [subject, setSubject] = useString(resource, property.subject);
  const [error, setError] = useState(null);
  return /* @__PURE__ */ React.createElement(ResourceSelector, {
    error,
    setError,
    resource,
    property,
    setSubject,
    subject,
    required
  });
}
