import React from "../pkg/react.js";
import {properties, urls} from "../helpers/urls.js";
import {useString, useResource, useTitle} from "../atomic-react/hooks.js";
import {ResourceStatus} from "../atomic-lib/resource.js";
import AllProps from "./AllProps.js";
import Markdown from "./datatypes/Markdown.js";
import AtomicLink from "./Link.js";
import ClassDetail from "./ClassDetail.js";
import {Card} from "./Card.js";
import CollectionCard from "./classes/CollectionCard.js";
import {ErrorLook} from "./datatypes/ResourceInline.js";
function ResourceCard({subject}) {
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [klass] = useString(resource, properties.isA);
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement(Card, {
      about: subject
    }, /* @__PURE__ */ React.createElement("p", null, "Loading..."));
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(Card, {
      about: subject
    }, /* @__PURE__ */ React.createElement(ErrorLook, null, resource.getError().message));
  }
  switch (klass) {
    case urls.classes.collection:
      return /* @__PURE__ */ React.createElement(CollectionCard, {
        resource
      });
  }
  return /* @__PURE__ */ React.createElement(Card, {
    about: subject
  }, /* @__PURE__ */ React.createElement(AtomicLink, {
    url: subject
  }, /* @__PURE__ */ React.createElement("h2", null, title)), /* @__PURE__ */ React.createElement(ClassDetail, {
    resource
  }), description && /* @__PURE__ */ React.createElement(Markdown, {
    text: description
  }), /* @__PURE__ */ React.createElement(AllProps, {
    resource,
    except: [properties.shortname, properties.description, properties.isA]
  }));
}
export default ResourceCard;
