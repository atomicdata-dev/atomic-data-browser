import * as React from "../pkg/react.js";
import {ContainerNarrow} from "../components/Containers.js";
import {ErrorLook} from "../components/ResourceInline.js";
function ErrorPage({resource, children}) {
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    resource: resource.getSubject()
  }, /* @__PURE__ */ React.createElement(ErrorLook, null, children));
}
export default ErrorPage;
