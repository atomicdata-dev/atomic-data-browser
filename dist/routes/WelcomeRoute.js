import * as React from "../pkg/react.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {ContainerNarrow} from "../components/Containers.js";
import AtomicLink, {LinkView} from "../components/Link.js";
export const Welcome = () => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(ContainerNarrow, null, /* @__PURE__ */ React.createElement("h1", null, "Atomic Data"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("em", null, "The easiest way to ", /* @__PURE__ */ React.createElement("b", null, "create"), ", ", /* @__PURE__ */ React.createElement("b", null, "share"), " and ", /* @__PURE__ */ React.createElement("b", null, "model"), " linked data.")), /* @__PURE__ */ React.createElement("p", null, "Atomic Data is a proposed standard for modeling and exchanging linked data. It uses links to connect pieces of data, and therefore makes it easier to connect datasets to each other - even when these datasets exist on separate machines. It aims to help realize a more decentralized internet that encourages data ownership and interoperability."), /* @__PURE__ */ React.createElement("p", null, "Atomic Data is especially suitable for knowledge graphs, distributed datasets, semantic data, p2p applications, decentralized apps, and data that is meant to be shared. It is designed to be highly extensible, easy to use, and to make the process of domain specific standardization as simple as possible. Check out", " ", /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement("a", {
    href: "https://docs.atomicdata.dev/"
  }, "the docs")), " ", "for more information about Atomic Data."), /* @__PURE__ */ React.createElement("h2", null, "About this app"), /* @__PURE__ */ React.createElement("p", null, "You're looking at ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic-data-browser"
  }, "atomic-data-browser"), ", an open-source client for viewing and editing data. Please add an issue if you encouter problems or have a feature request. Expect bugs and issues, because this stuff is pretty beta."), /* @__PURE__ */ React.createElement("p", null, "The back-end of this app is ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic"
  }, "atomic-server"), ", which you can think of as an open source, web-native database."), /* @__PURE__ */ React.createElement("p", null, "You can edit app settings, such as current user and theme color at", " ", /* @__PURE__ */ React.createElement(LinkView, {
    onClick: () => history.push("/settings")
  }, "/settings"), "."), /* @__PURE__ */ React.createElement("p", null, "Check out the keyboard shortcuts at ", /* @__PURE__ */ React.createElement(LinkView, {
    onClick: () => history.push("/shortcuts")
  }, "/shortcuts"), "."), /* @__PURE__ */ React.createElement("h2", null, "Things to visit"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "https://atomicdata.dev/collections/collection"
  }, "List of lists")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "https://atomicdata.dev/collections/class"
  }, "List of Classes")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "https://atomicdata.dev/collections/property"
  }, "List of Properties"))), /* @__PURE__ */ React.createElement("h2", null, "Run your own server"), /* @__PURE__ */ React.createElement("p", null, "The easiest way to run an ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic"
  }, "atomic-server"), " is by using Docker:"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("code", null, "docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server")), /* @__PURE__ */ React.createElement("p", null, "...and visit ", /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "http://localhost/collections/collection"
  }, "localhost"), "."), /* @__PURE__ */ React.createElement("h2", null, "Join the community"), /* @__PURE__ */ React.createElement("p", null, "Atomic Data is open and fully powered by volunteers. We're looking for people who want to help discuss various design challenges and work on implmenentations. If you have any questions, or want to help out, feel free to join our", " ", /* @__PURE__ */ React.createElement("a", {
    href: "https://discord.gg/a72Rv2P"
  }, "Discord"), "!"));
};
