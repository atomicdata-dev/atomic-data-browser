import React, {useState} from "../pkg/react.js";
import {useHistory} from "../pkg/react-router.js";
import {StringParam, useQueryParam} from "../pkg/use-query-params.js";
import {properties, urls} from "../helpers/urls.js";
import {newURL} from "../helpers/navigation.js";
import {useArray, useResource, useStore, useString, useTitle} from "../atomic-react/hooks.js";
import {ContainerNarrow} from "../components/Containers.js";
import {InputStyled} from "../components/forms/InputStyles.js";
import NewIntanceButton from "../components/NewInstanceButton.js";
import {ResourceForm} from "../components/forms/ResourceForm.js";
import {ResourceStatus} from "../atomic-lib/resource.js";
import AtomicLink from "../components/Link.js";
import Markdown from "../components/datatypes/Markdown.js";
function New() {
  const [classSubject] = useQueryParam("classSubject", StringParam);
  const [klass] = useResource(classSubject);
  const klassTitle = useTitle(klass);
  const [klassDescription] = useString(klass, properties.description);
  const [classInput, setClassInput] = useState(null);
  const [newSubject, setNewSubject] = useState(null);
  const history = useHistory();
  const store = useStore();
  if (newSubject == void 0) {
    setNewSubject(store.createSubject());
  }
  const [resource] = useResource(newSubject);
  if (resource.getStatus() !== ResourceStatus.ready) {
    resource.setStatus(ResourceStatus.ready);
  }
  const [currentClass] = useArray(resource, properties.isA);
  if (currentClass.length == 0) {
    resource.setValidate(properties.isA, [klass.getSubject()], store);
  }
  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(classInput));
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, null, classSubject ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "new ", /* @__PURE__ */ React.createElement(AtomicLink, {
    url: classSubject
  }, klassTitle)), klassDescription && /* @__PURE__ */ React.createElement(Markdown, {
    text: klassDescription
  }), /* @__PURE__ */ React.createElement(ResourceForm, {
    resource,
    classSubject,
    key: `${classSubject}+${newSubject}`
  })) : /* @__PURE__ */ React.createElement("form", {
    onSubmit: handleClassSet
  }, /* @__PURE__ */ React.createElement("h1", null, "Create something new"), /* @__PURE__ */ React.createElement(Examples, null), /* @__PURE__ */ React.createElement("p", null, "... or enter the URL of an existing Class:"), /* @__PURE__ */ React.createElement(InputStyled, {
    value: classInput || null,
    onChange: (e) => setClassInput(e.target.value),
    placeholder: "Enter a Class URL..."
  })));
}
export default New;
function Examples() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NewIntanceButton, {
    klass: urls.classes.class
  }), /* @__PURE__ */ React.createElement(NewIntanceButton, {
    klass: urls.classes.property
  }));
}
