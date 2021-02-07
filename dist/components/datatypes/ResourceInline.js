import React from "../../../_snowpack/pkg/react.js";
import styled from "../../../_snowpack/pkg/styled-components.js";
import {urls} from "../../helpers/urls.js";
import {useString, useResource, useTitle} from "../../lib/react.js";
import {ResourceStatus} from "../../lib/resource.js";
import Link from "../Link.js";
function ResourceInline({url}) {
  const resource = useResource(url);
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return null;
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(ErrorLook, null, "Error: ", resource.getError().message);
  }
  const title = useTitle(resource);
  const description = useString(resource, urls.properties.description);
  return /* @__PURE__ */ React.createElement(Link, {
    url
  }, /* @__PURE__ */ React.createElement("span", {
    title: description ? description : null
  }, title));
}
const ErrorLook = styled.div`
  color: ${(props) => props.theme.colors.alert};
  font-family: monospace;
`;
export default ResourceInline;
