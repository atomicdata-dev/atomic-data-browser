import {Datatype} from "../../atomic-lib/datatypes.js";
import React from "../../pkg/react.js";
import InputString from "./InputString.js";
import {InputResource} from "./InputResource.js";
import InputResourceArray from "./InputResourceArray.js";
import InputMarkdown from "./InputMarkdown.js";
import InputNumber from "./InputNumber.js";
import InputBoolean from "./InputBoolean.js";
export default function InputSwitcher({resource, property, required}) {
  switch (property.datatype) {
    case Datatype.STRING: {
      return /* @__PURE__ */ React.createElement(InputString, {
        resource,
        property,
        required
      });
    }
    case Datatype.MARKDOWN: {
      return /* @__PURE__ */ React.createElement(InputMarkdown, {
        resource,
        property,
        required
      });
    }
    case Datatype.SLUG: {
      return /* @__PURE__ */ React.createElement(InputString, {
        resource,
        property,
        required
      });
    }
    case Datatype.TIMESTAMP:
    case Datatype.INTEGER: {
      return /* @__PURE__ */ React.createElement(InputNumber, {
        resource,
        property,
        required
      });
    }
    case Datatype.ATOMIC_URL: {
      return /* @__PURE__ */ React.createElement(InputResource, {
        resource,
        property,
        required
      });
    }
    case Datatype.RESOURCEARRAY: {
      return /* @__PURE__ */ React.createElement(InputResourceArray, {
        resource,
        property,
        required
      });
    }
    case Datatype.BOOLEAN: {
      return /* @__PURE__ */ React.createElement(InputBoolean, {
        resource,
        property,
        required
      });
    }
    default: {
      return /* @__PURE__ */ React.createElement(InputString, {
        resource,
        property,
        required
      });
    }
  }
}
