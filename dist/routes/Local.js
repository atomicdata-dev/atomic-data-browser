import * as React from "../pkg/react.js";
import ResourcePage from "../components/ResourcePage.js";
const Local = () => {
  return /* @__PURE__ */ React.createElement(ResourcePage, {
    key: window.location.href,
    subject: window.location.href
  });
};
export default Local;
