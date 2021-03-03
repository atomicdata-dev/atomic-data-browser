import React from "../../pkg/react.js";
import {useArray, useResource, useStore, useTitle} from "../../atomic-react/hooks.js";
import {urls} from "../../helpers/urls.js";
import {ErrMessage} from "./InputStyles.js";
import {DropDownList} from "./Dropdownlist.js";
export function ResourceSelector({
  required,
  setSubject,
  subject,
  handleRemove,
  error,
  setError,
  property
}) {
  const [classesCollection] = useResource(getCollection(property.classType));
  let [options] = useArray(classesCollection, urls.properties.collection.members);
  const [classType] = useResource(property.classType);
  const classTypeTitle = useTitle(classType);
  const store = useStore();
  function handleUpdate(newval) {
    setSubject(newval ? newval : "", setError);
  }
  let placeholder = "Enter an Atomic URL...";
  if (options.length == 0) {
    options = store.getAllSubjects();
  }
  if (property.classType && classTypeTitle?.length > 0) {
    placeholder = `Enter a ${classTypeTitle} URL...`;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DropDownList, {
    placeholder,
    required,
    onUpdate: handleUpdate,
    options,
    onRemove: handleRemove,
    initial: subject
  }), subject !== "" && error && /* @__PURE__ */ React.createElement(ErrMessage, null, error?.message), subject == "" && /* @__PURE__ */ React.createElement(ErrMessage, null, "Required"));
}
function getCollection(classtypeUrl) {
  switch (classtypeUrl) {
    case urls.classes.property:
      return "https://atomicdata.dev/properties";
    case urls.classes.class:
      return "https://atomicdata.dev/classes";
    case urls.classes.agent:
      return "https://atomicdata.dev/agents";
    case urls.classes.commit:
      return "https://atomicdata.dev/commits";
    case urls.classes.datatype:
      return "https://atomicdata.dev/datatypes";
  }
}
