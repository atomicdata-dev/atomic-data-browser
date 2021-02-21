import React, {useState} from "../pkg/react.js";
import {useHistory} from "../pkg/react-router.js";
import {useResource, useTitle} from "../atomic-react/hooks.js";
import {newURL} from "../helpers/navigation.js";
import {ContainerNarrow} from "../components/Containers.js";
import {InputStyled} from "../components/forms/InputStyles.js";
import {ResourceForm} from "../components/forms/ResourceForm.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
export function Edit() {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [subjectInput, setSubjectInput] = useState(null);
  const history = useHistory();
  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(subjectInput));
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, null, subject ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "edit ", title), /* @__PURE__ */ React.createElement(ResourceForm, {
    resource,
    key: subject
  })) : /* @__PURE__ */ React.createElement("form", {
    onSubmit: handleClassSet
  }, /* @__PURE__ */ React.createElement("h1", null, "edit a resource"), /* @__PURE__ */ React.createElement(InputStyled, {
    value: subjectInput || null,
    onChange: (e) => setSubjectInput(e.target.value),
    placeholder: "Enter a Resource URL..."
  })));
}
