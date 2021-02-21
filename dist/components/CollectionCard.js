import React from "../pkg/react.js";
import {properties} from "../helpers/urls.js";
import {useArray, useString, useTitle} from "../atomic-react/hooks.js";
import Markdown from "./datatypes/Markdown.js";
import AtomicLink from "./Link.js";
import {Card, CardInsideFull, CardRow} from "./Card.js";
import ResourceInline from "./datatypes/ResourceInline.js";
function CollectionCard({resource}) {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [members] = useArray(resource, properties.collection.members);
  return /* @__PURE__ */ React.createElement(Card, {
    about: resource.getSubject()
  }, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: resource.getSubject()
  }, /* @__PURE__ */ React.createElement("h2", null, title)), description && /* @__PURE__ */ React.createElement(Markdown, {
    text: description
  }), /* @__PURE__ */ React.createElement(CardInsideFull, null, members.map((member) => {
    return /* @__PURE__ */ React.createElement(CardRow, {
      key: member
    }, /* @__PURE__ */ React.createElement(ResourceInline, {
      subject: member
    }));
  })));
}
export default CollectionCard;
