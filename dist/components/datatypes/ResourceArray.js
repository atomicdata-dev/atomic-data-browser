import React from "../../../_snowpack/pkg/react.js";
import ResourceInline from "./ResourceInline.js";
function ResourceArray({array}) {
  return /* @__PURE__ */ React.createElement("div", null, array.map((url, index) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: url
    }, /* @__PURE__ */ React.createElement(ResourceInline, {
      url
    }), index !== array.length - 1 && ", ");
  }));
}
export default ResourceArray;
