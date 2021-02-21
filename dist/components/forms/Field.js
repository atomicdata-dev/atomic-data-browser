import * as React from "../../pkg/react.js";
import {useState} from "../../pkg/react.js";
import {useProperty} from "../../atomic-react/hooks.js";
import {FaInfo} from "../../pkg/react-icons/fa.js";
import {ButtonIcon} from "../Button.js";
import AtomicLink from "../Link.js";
import InputSwitcher from "./InputSwitcher.js";
import {FieldStyled, InputStyled, InputWrapper, LabelHelper, LabelStyled, LabelWrapper} from "./InputStyles.js";
function FieldLabeled({property: propertyURL, resource, required}) {
  const property = useProperty(propertyURL);
  const [collapsedHelper, setCollapsed] = useState(true);
  if (property == null) {
    return /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelWrapper, null, /* @__PURE__ */ React.createElement(LabelStyled, null, "loading...")), /* @__PURE__ */ React.createElement(InputWrapper, null, /* @__PURE__ */ React.createElement(InputStyled, null)));
  }
  return /* @__PURE__ */ React.createElement(FieldStyled, null, /* @__PURE__ */ React.createElement(LabelWrapper, {
    title: property.description
  }, /* @__PURE__ */ React.createElement(LabelStyled, null, property.shortname, " ", /* @__PURE__ */ React.createElement(ButtonIcon, {
    type: "button",
    onClick: () => setCollapsed(!collapsedHelper)
  }, /* @__PURE__ */ React.createElement(FaInfo, null)))), !collapsedHelper && /* @__PURE__ */ React.createElement(LabelHelper, null, property.description, " ", /* @__PURE__ */ React.createElement(AtomicLink, {
    url: propertyURL
  }, "Go to Property")), /* @__PURE__ */ React.createElement(InputSwitcher, {
    resource,
    property,
    required
  }));
}
export default FieldLabeled;
