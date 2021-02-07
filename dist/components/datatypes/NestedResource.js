import React from "../../pkg/react.js";
function Nestedresource({resource}) {
  return /* @__PURE__ */ React.createElement("div", {
    title: "Nested Resource"
  }, JSON.stringify(resource));
}
export default Nestedresource;
