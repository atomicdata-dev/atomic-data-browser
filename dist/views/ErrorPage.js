import * as React from "../pkg/react.js";
import {ContainerNarrow} from "../components/Containers.js";
import {ErrorLook} from "../components/ResourceInline.js";
import {Button} from "../components/Button.js";
function ErrorPage({resource, children, error, clearError}) {
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    resource: resource?.getSubject()
  }, /* @__PURE__ */ React.createElement(ErrorLook, null, children ? children : JSON.stringify(error?.message)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    onClick: clearError
  }, "Clear error"), /* @__PURE__ */ React.createElement(Button, {
    onClick: window.location.reload
  }, "Reload page")));
}
export default ErrorPage;
