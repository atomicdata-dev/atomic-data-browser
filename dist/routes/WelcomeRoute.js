import * as React from "../pkg/react.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {ContainerNarrow} from "../components/Containers.js";
import AtomicLink, {LinkView} from "../components/Link.js";
export const Welcome = () => {
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(ContainerNarrow, null, /* @__PURE__ */ React.createElement("h1", null, "Atomic Data"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", {
    href: "https://atomicdata.dev"
  }, "Atomic Data"), " is a new set of standards designed to make it easier to share, create and model linked data. Check out", " ", /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement("a", {
    href: "https://docs.atomicdata.dev/"
  }, "the docs")), " ", "for more information about Atomic Data."), /* @__PURE__ */ React.createElement("p", null, "This app is for viewing, editing and creating Atomic Data. It's free and open source on", " ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic-data-browser"
  }, "github"), ". Please add an issue if you encouter problems or have a feature request. Expect bugs and issues, because this stuff is pretty beta."), /* @__PURE__ */ React.createElement("p", null, "You can edit app settings, such as current user and theme color at", " ", /* @__PURE__ */ React.createElement(LinkView, {
    onClick: () => history.push("/settings")
  }, "/settings"), "."), /* @__PURE__ */ React.createElement("p", null, "Check out the keyboard shortcuts at ", /* @__PURE__ */ React.createElement(LinkView, {
    onClick: () => history.push("/shortcuts")
  }, "/shortcuts"), "."), /* @__PURE__ */ React.createElement("p", null, "Some ", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/joepio/atomic"
  }, "atomic-servers"), " to visit with this browser:"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "https://atomicdata.dev/collections"
  }, "atomicdata.dev")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "https://surfy.ddns.net/collections"
  }, "surfy.ddns.net"))), /* @__PURE__ */ React.createElement("p", null, "Or run your own server..."), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("code", null, "docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server")), /* @__PURE__ */ React.createElement("p", null, "...and visit ", /* @__PURE__ */ React.createElement(AtomicLink, {
    url: "http://localhost/collections"
  }, "localhost"), "."), /* @__PURE__ */ React.createElement("p", null, "If you have any questions, feel free to join our ", /* @__PURE__ */ React.createElement("a", {
    href: "https://discord.gg/a72Rv2P"
  }, "Discord"), "!"));
};
