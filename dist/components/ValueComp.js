import React from "../pkg/react.js";
import {Datatype} from "../atomic-lib/datatypes.js";
import ResourceInline from "./datatypes/ResourceInline.js";
import DateTime from "./datatypes/DateTime.js";
import Markdown from "./datatypes/Markdown.js";
import Nestedresource from "./datatypes/NestedResource.js";
import ResourceArray from "./datatypes/ResourceArray.js";
function ValueComp({value, datatype}) {
  switch (datatype) {
    case Datatype.ATOMIC_URL: {
      const resource = value.toResource();
      if (typeof resource == "string") {
        return /* @__PURE__ */ React.createElement(ResourceInline, {
          subject: resource
        });
      }
      return /* @__PURE__ */ React.createElement(Nestedresource, {
        resource
      });
    }
    case Datatype.DATE:
      return /* @__PURE__ */ React.createElement(DateTime, {
        date: value.toDate()
      });
    case Datatype.MARKDOWN:
      return /* @__PURE__ */ React.createElement(Markdown, {
        text: value.toString()
      });
    case Datatype.RESOURCEARRAY:
      return /* @__PURE__ */ React.createElement(ResourceArray, {
        subjects: value.toArray()
      });
    case Datatype.TIMESTAMP:
      return /* @__PURE__ */ React.createElement(DateTime, {
        date: value.toDate()
      });
    default:
      return /* @__PURE__ */ React.createElement("div", null, value.toString());
  }
}
export default ValueComp;
