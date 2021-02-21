import React from "../../pkg/react.js";
import styled from "../../pkg/styled-components.js";
import {urls} from "../../helpers/urls.js";
import {useString, useResource, useTitle} from "../../atomic-react/hooks.js";
import {ResourceStatus} from "../../atomic-lib/resource.js";
import AtomicLink from "../Link.js";
function ResourceInline({subject}) {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, urls.properties.description);
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement("span", {
      about: subject
    }, "...");
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(AtomicLink, {
      url: subject
    }, /* @__PURE__ */ React.createElement(ErrorLook, {
      about: subject,
      title: resource.getError().message
    }, "error"));
  }
  return /* @__PURE__ */ React.createElement(AtomicLink, {
    url: subject
  }, /* @__PURE__ */ React.createElement("span", {
    title: description ? description : null
  }, title));
}
export const ErrorLook = styled.span`
  color: ${(props) => props.theme.colors.alert};
  font-family: monospace;
`;
export default ResourceInline;
