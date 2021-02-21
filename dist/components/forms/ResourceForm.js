import React, {useState} from "../../pkg/react.js";
import {useHistory} from "../../pkg/react-router-dom.js";
import {ResourceStatus} from "../../atomic-lib/resource.js";
import {useArray, useResource, useStore, useString} from "../../atomic-react/hooks.js";
import {handleError} from "../../helpers/handlers.js";
import {openURL} from "../../helpers/navigation.js";
import {classes, properties} from "../../helpers/urls.js";
import {ButtonMargin} from "../Button.js";
import FieldLabeled from "./Field.js";
import {ErrMessage} from "./InputStyles.js";
export function ResourceForm({classSubject, resource}) {
  const [isAArray] = useArray(resource, properties.isA);
  if (classSubject == void 0 && isAArray?.length > 0) {
    classSubject = isAArray[0];
  }
  const [klass] = useResource(classSubject);
  const store = useStore();
  const resourceStatus = resource.getStatus();
  const classStatus = klass.getStatus();
  const [requires] = useArray(klass, properties.requires);
  const [recommends] = useArray(klass, properties.recommends);
  const [klassIsa] = useString(klass, properties.isA);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  if (resourceStatus == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "Loading resource...");
  }
  if (resourceStatus == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, resource.getError().message);
  }
  if (classStatus == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, "Loading class...");
  }
  if (classStatus == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, klass.getError().message);
  }
  if (klassIsa !== classes.class) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, classSubject, " is not a Class. Only resources with valid classes can be created or edited at this moment.");
  }
  const otherProps = [];
  async function save() {
    setErr(null);
    try {
      resource.setStatus(ResourceStatus.ready);
      const newUrlString = await resource.save(store);
      setSaving(false);
      history.push(openURL(newUrlString));
    } catch (e) {
      handleError(e);
      setErr(e);
      setSaving(false);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    save();
  }
  let warning = null;
  if (!resource.getSubject().includes(store.getBaseUrl())) {
    warning = `You're trying to edit / create a resource (${resource.getSubject()}) outside of your Base URL (${store.getBaseUrl()}). You might not have the rights to edit this.`;
  }
  const agent = store.getAgent();
  if (agent == null) {
    warning = `No Agent has been set. You can't edit or post resources. Go to the settings page (press 's') and enter an Agent.`;
  }
  return /* @__PURE__ */ React.createElement("form", {
    about: resource.getSubject()
  }, warning && /* @__PURE__ */ React.createElement(ErrMessage, null, "\u26A0\uFE0F", warning), requires.map((property) => {
    return /* @__PURE__ */ React.createElement(FieldLabeled, {
      key: property,
      property,
      resource,
      required: true
    });
  }), recommends.map((property) => {
    return /* @__PURE__ */ React.createElement(FieldLabeled, {
      key: property,
      property,
      resource
    });
  }), otherProps.map((property) => {
    return /* @__PURE__ */ React.createElement(FieldLabeled, {
      key: property,
      property,
      resource
    });
  }), agent && /* @__PURE__ */ React.createElement(ButtonMargin, {
    type: "button",
    onClick: handleSubmit,
    disabled: saving
  }, saving ? "wait..." : "save"), err && /* @__PURE__ */ React.createElement(ErrMessage, null, err.message));
}
