import * as React from "../pkg/react.js";
import {properties} from "../link/lib/src/index.js";
import {useArray} from "../link/react/src/index.js";
import {ContainerNarrow} from "../components/Containers.js";
function DocumentPage({resource}) {
  const [elements, setElements] = useArray(resource, properties.document.elements);
  function handleCreateElement() {
    elements.push("newSubject");
    setElements(elements);
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    about: resource.getSubject()
  }, /* @__PURE__ */ React.createElement("h1", null, "Document"), elements.map((element) => /* @__PURE__ */ React.createElement("p", {
    key: element
  }, element)), /* @__PURE__ */ React.createElement("input", {
    value: "new element",
    onChange: handleCreateElement
  }));
}
export default DocumentPage;
