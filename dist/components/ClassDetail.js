import React from "../pkg/react.js";
import styled from "../pkg/styled-components.js";
import {properties} from "../helpers/urls.js";
import {useString} from "../atomic-react/hooks.js";
import ResourceInline from "./datatypes/ResourceInline.js";
function ClassDetail({resource}) {
  const [klass] = useString(resource, properties.isA);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, klass && /* @__PURE__ */ React.createElement(ClassDetailStyled, null, "is a ", /* @__PURE__ */ React.createElement(ResourceInline, {
    subject: klass
  })));
}
const ClassDetailStyled = styled.div`
  margin-bottom: 0.5rem;
  margin-top: -0.5rem;
  font-style: italic;
`;
export default ClassDetail;
