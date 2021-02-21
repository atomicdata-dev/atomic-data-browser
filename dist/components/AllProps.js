import React from "../pkg/react.js";
import PropVal from "./PropVal.js";
function AllProps({resource, except = []}) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, [...resource.getPropVals()].map(([prop, val]) => {
    if (except.includes(prop)) {
      return null;
    }
    return /* @__PURE__ */ React.createElement(PropVal, {
      key: prop,
      propertyURL: prop,
      value: val
    });
  }));
}
export default AllProps;
