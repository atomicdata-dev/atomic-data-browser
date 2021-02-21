import React from "../pkg/react.js";
import styled from "../pkg/styled-components.js";
import {useProperty} from "../atomic-react/hooks.js";
import AtomicLink from "./Link.js";
import ValueComp from "./ValueComp.js";
const PropValRow = styled.div`
  display: block;
  margin-bottom: ${(props) => props.theme.margin}rem;
`;
const PropertyLabel = styled.span`
  font-weight: bold;
  display: block;
`;
function PropVal({propertyURL, value}) {
  const property = useProperty(propertyURL);
  if (property == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(PropValRow, null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: propertyURL
  }, /* @__PURE__ */ React.createElement(PropertyLabel, {
    title: property.description
  }, property.shortname || propertyURL)), /* @__PURE__ */ React.createElement(ValueComp, {
    value,
    datatype: property.datatype
  }));
}
export default PropVal;
