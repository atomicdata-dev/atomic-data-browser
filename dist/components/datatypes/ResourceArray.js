import React, {useState} from "../../pkg/react.js";
import styled from "../../pkg/styled-components.js";
import ResourceInline from "./ResourceInline.js";
const MAX_COUNT = 10;
function ResourceArray({subjects: subjectsIn}) {
  const [showAll, setShowMore] = useState(false);
  const tooMany = subjectsIn.length > MAX_COUNT;
  let subjects = subjectsIn;
  if (!showAll && tooMany) {
    subjects = subjects.slice(0, MAX_COUNT);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, subjects.map((url, index) => {
    return /* @__PURE__ */ React.createElement(React.Fragment, {
      key: url
    }, /* @__PURE__ */ React.createElement(ResourceInline, {
      subject: url
    }), index !== subjects.length - 1 && ", ");
  }), tooMany && /* @__PURE__ */ React.createElement(ShowMoreButton, {
    onClick: () => setShowMore(!showAll)
  }, showAll ? "show less" : `show ${subjectsIn.length - MAX_COUNT} more`));
}
const ShowMoreButton = styled.span`
  cursor: pointer;
  margin-left: 0.5em;

  &:hover {
    text-decoration: underline;
  }
`;
export default ResourceArray;
