import React from "../pkg/react.js";
import {useResource, useStore} from "../atomic-react/hooks.js";
import {ResourceStatus} from "../atomic-lib/resource.js";
import AllProps from "../components/AllProps.js";
import {ContainerNarrow} from "../components/Containers.js";
import AtomicLink from "../components/Link.js";
import {ButtonMargin} from "../components/Button.js";
import {editURL, openURL} from "../helpers/navigation.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
function Data() {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const history = useHistory();
  const store = useStore();
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement(ContainerNarrow, null, "Loading...");
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(ContainerNarrow, null, resource.getError().message);
  }
  function handleDestroy() {
    resource.destroy(store);
    history.push("/");
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    about: subject
  }, /* @__PURE__ */ React.createElement("h1", null, "data view"), /* @__PURE__ */ React.createElement("h3", null, "subject: ", /* @__PURE__ */ React.createElement(AtomicLink, {
    url: subject
  }, subject)), /* @__PURE__ */ React.createElement(ButtonMargin, {
    type: "button",
    onClick: () => history.push(editURL(subject))
  }, "edit"), /* @__PURE__ */ React.createElement(ButtonMargin, {
    type: "button",
    onClick: () => history.push(openURL(subject))
  }, "normal view"), /* @__PURE__ */ React.createElement(ButtonMargin, {
    type: "button",
    onClick: handleDestroy
  }, "delete"), /* @__PURE__ */ React.createElement(AllProps, {
    resource
  }));
}
export default Data;
