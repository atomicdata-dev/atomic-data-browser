import * as React from "../pkg/react.js";
import {Container} from "./Container.js";
import Link from "./Link.js";
export const Welcome = () => {
  return /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement("h1", null, "Atomic Data"), /* @__PURE__ */ React.createElement("p", null, "This app is built using ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic-react"
  }, "atomic-react"), ", a typescript library for rendering and editing Atomic Data."), /* @__PURE__ */ React.createElement("p", null, "Some Atomic Data servers to check out:"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Link, {
    url: "https://atomicdata.dev/collections"
  }, "atomicdata.dev")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(Link, {
    url: "https://surfy.ddns.net/collections"
  }, "surfy.ddns.net"))));
};
