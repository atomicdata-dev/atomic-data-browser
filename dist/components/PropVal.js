import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {StringParam, useQueryParam} from "../../_snowpack/pkg/use-query-params.js";
import {useProperty} from "../lib/react.js";
import ValueComp from "./ValueComp.js";
const PropValRow = styled.div`
  display: block;
  margin-bottom: 1rem;
`;
const PropertyLabel = styled.a`
  font-weight: bold;
  display: block;
`;
function PropVal({propertyURL, value}) {
  const [, setSubject] = useQueryParam("subject", StringParam);
  const property = useProperty(propertyURL);
  const handleClickProp = (e) => {
    e.preventDefault();
    setSubject(propertyURL);
  };
  if (property == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(PropValRow, null, /* @__PURE__ */ React.createElement(PropertyLabel, {
    onClick: handleClickProp,
    href: propertyURL,
    title: property.description
  }, property.shortname || propertyURL), /* @__PURE__ */ React.createElement(ValueComp, {
    value,
    datatype: property.datatype
  }));
}
export default PropVal;
