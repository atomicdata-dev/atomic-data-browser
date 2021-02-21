import React from "../pkg/react.js";
import styled from "../pkg/styled-components.js";
import {properties, urls} from "../helpers/urls.js";
import {useArray, useProperty, useString, useValue, useResource} from "../atomic-react/hooks.js";
import ResourceInline from "./datatypes/ResourceInline.js";
import ValueComp from "./ValueComp.js";
function Table({resource, members}) {
  const [klass] = useString(resource, properties.collection.value);
  const [classResource] = useResource(klass);
  const [requiredProps] = useArray(classResource, urls.properties.requires);
  const [recommendedProps] = useArray(classResource, urls.properties.recommends);
  const propsArrayFull = requiredProps.concat(recommendedProps);
  const propsArray = propsArrayFull.filter((item) => item !== urls.properties.shortname);
  if (resource == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(TableStyled, null, /* @__PURE__ */ React.createElement(Header, {
    klass: classResource,
    propsArray
  }), /* @__PURE__ */ React.createElement("tbody", null, members.map((member) => {
    return /* @__PURE__ */ React.createElement(Row, {
      propsArray,
      key: member,
      subject: member
    });
  })));
}
const TableStyled = styled.table`
  display: block;
  overflow-y: auto;
  border-collapse: collapse;
`;
function Header({klass, propsArray}) {
  if (klass == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement(CellStyled, {
    header: true
  }, "subject"), propsArray.map((prop) => {
    return /* @__PURE__ */ React.createElement(CellStyled, {
      header: true,
      key: prop
    }, /* @__PURE__ */ React.createElement(ResourceInline, {
      subject: prop
    }));
  })));
}
function Row({subject, propsArray}) {
  const [resource] = useResource(subject);
  if (resource == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(RowStyled, {
    about: subject
  }, /* @__PURE__ */ React.createElement(CellStyled, null, /* @__PURE__ */ React.createElement(ResourceInline, {
    subject
  })), propsArray.map((prop) => {
    return /* @__PURE__ */ React.createElement(Cell, {
      key: prop,
      resource,
      prop
    });
  }));
}
const RowStyled = styled.tr`
  border-top: solid 1px ${(props) => props.theme.colors.bg2};
`;
function Cell({resource, prop: propUrl}) {
  const [value] = useValue(resource, propUrl);
  const fullprop = useProperty(propUrl);
  if (value == null) {
    return null;
  }
  if (fullprop == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(CellStyled, null, /* @__PURE__ */ React.createElement(ValueComp, {
    key: propUrl,
    value,
    datatype: fullprop.datatype
  }));
}
const CellStyled = styled.td`
  padding: 0.3rem;
  font-weight: ${(props) => props.header ? "bold" : ``};
`;
export default Table;
