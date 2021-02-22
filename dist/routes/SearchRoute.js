import React, {useRef, useState} from "../pkg/react.js";
import {ContainerNarrow} from "../components/Containers.js";
import {useSearch} from "../helpers/useSearch.js";
import ResourceInline from "../components/datatypes/ResourceInline.js";
import {Card} from "../components/Card.js";
import {useHotkeys} from "../pkg/react-hotkeys-hook.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {openURL} from "../helpers/navigation.js";
const MAX_COUNT = 30;
export function Search({query}) {
  const [selectedIndex, setSelected] = useState(0);
  const index = useSearch();
  const history = useHistory();
  const htmlElRef = useRef(null);
  function moveTo(index2) {
    setSelected(index2);
    const offset = -40;
    const y = htmlElRef.current.children[index2].getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({top: y, behavior: "smooth"});
  }
  useHotkeys("enter", (e) => {
    e.preventDefault();
    const subject = htmlElRef.current.children[selectedIndex].getAttribute("about");
    document?.activeElement?.blur();
    history.push(openURL(subject));
  }, {enableOnTags: ["INPUT"]});
  useHotkeys("up", (e) => {
    e.preventDefault();
    const newSelected = selectedIndex > 0 ? selectedIndex - 1 : 0;
    moveTo(newSelected);
  }, {enableOnTags: ["INPUT"]});
  useHotkeys("down", (e) => {
    e.preventDefault();
    const newSelected = selectedIndex == results.length - 1 ? results.length - 1 : selectedIndex + 1;
    moveTo(newSelected);
  }, {enableOnTags: ["INPUT"]});
  if (index == null) {
    return /* @__PURE__ */ React.createElement("p", null, "Building search index...");
  }
  const resultsIn = index.search(query);
  const tooMany = resultsIn.length > MAX_COUNT;
  let results = resultsIn;
  if (tooMany) {
    results = results.slice(0, MAX_COUNT);
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    ref: htmlElRef
  }, results.length == 0 && /* @__PURE__ */ React.createElement("p", null, "No results found for ", query), results.map((hit, index2) => {
    const resource = hit.item;
    console.log(resource.subject, hit);
    return /* @__PURE__ */ React.createElement(Card, {
      about: resource.subject,
      key: `${index2}${selectedIndex}`,
      selected: index2 == selectedIndex
    }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(ResourceInline, {
      key: resource.subject,
      subject: resource.subject
    })));
  }));
}
