import React from "../pkg/react.js";
import {urls} from "../helpers/urls.js";
import {useString, useResource, useTitle} from "../atomic-react/hooks.js";
import {ResourceStatus} from "../atomic-lib/resource.js";
import {ErrorLook} from "./datatypes/ResourceInline.js";
function ResourceLine({subject}) {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement("span", {
      about: subject
    }, "Loading...");
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(ErrorLook, {
      about: subject
    }, "Error: ", resource.getError().message);
  }
  return /* @__PURE__ */ React.createElement("span", {
    about: subject
  }, /* @__PURE__ */ React.createElement("b", null, title), description ? ` - ${description}` : null);
}
export default ResourceLine;
