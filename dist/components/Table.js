import React from "../pkg/react.js";
import styled from "../pkg/styled-components.js";
import {urls} from "../helpers/urls.js";
import {useProperty, useValue, useResource} from "../atomic-react/hooks.js";
import ResourceInline from "./datatypes/ResourceInline.js";
import ValueComp from "./ValueComp.js";
import {useSubjectParam} from "../helpers/useCurrentSubject.js";
import {FaSort, FaSortDown, FaSortUp} from "../pkg/react-icons/fa.js";
import {Button} from "./Button.js";
function Table({resource, members, columns}) {
  const propsArray = columns.filter((item) => item !== urls.properties.shortname);
  if (resource == null) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(TableStyled, null, /* @__PURE__ */ React.createElement(Header, {
    columns: propsArray
  }), members.length > 0 ? /* @__PURE__ */ React.createElement("tbody", null, members.map((member) => {
    return /* @__PURE__ */ React.createElement(Row, {
      propsArray,
      key: member,
      subject: member
    });
  })) : /* @__PURE__ */ React.createElement("p", null, "This collection is empty"));
}
const TableStyled = styled.table`
  display: block;
  overflow-y: auto;
  border-collapse: collapse;
`;
function Header({columns}) {
  return /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement(CellStyled, {
    header: true
  }, "subject"), columns.map((prop) => {
    return /* @__PURE__ */ React.createElement(HeaderItem, {
      key: prop,
      subject: prop
    });
  })));
}
function HeaderItem({subject}) {
  const [sortBy, setSortBy] = useSubjectParam("sort_by");
  const [sortDesc, setSortDesc] = useSubjectParam("sort_desc");
  function handleToggleSort() {
    if (sortBy == subject) {
      if (sortDesc == "true") {
        setSortDesc(null);
      } else {
        setSortDesc("true");
      }
    } else {
      setSortBy(subject);
    }
  }
  return /* @__PURE__ */ React.createElement(CellStyled, {
    header: true
  }, /* @__PURE__ */ React.createElement(ResourceInline, {
    subject
  }), " ", /* @__PURE__ */ React.createElement(Button, {
    onClick: handleToggleSort,
    subtle: true,
    icon: true
  }, sortBy == subject ? sortDesc == "true" ? /* @__PURE__ */ React.createElement(FaSortDown, null) : /* @__PURE__ */ React.createElement(FaSortUp, null) : /* @__PURE__ */ React.createElement(FaSort, null)));
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
    return /* @__PURE__ */ React.createElement(CellStyled, null);
  }
  if (fullprop == null) {
    return /* @__PURE__ */ React.createElement(CellStyled, null);
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
  /* word-break: keep-all; */
  white-space: ${(props) => props.header ? "nowrap" : ``};
`;
export default Table;
