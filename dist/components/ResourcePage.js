import React from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import {properties, urls} from "../helpers/urls.js";
import {useString, useResource, useTitle} from "../lib/react.js";
import {ResourceStatus} from "../lib/resource.js";
import AllProps from "./AllProps.js";
import {Container} from "./Container.js";
import ResourceInline from "./datatypes/ResourceInline.js";
import Markdown from "./datatypes/Markdown.js";
import Table from "./Table.js";
function ResourcePage({subject}) {
  const resource = useResource(subject);
  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return /* @__PURE__ */ React.createElement(Container, null, "Loading...");
  }
  if (status == ResourceStatus.error) {
    return /* @__PURE__ */ React.createElement(Container, null, resource.getError().message);
  }
  const title = useTitle(resource);
  const description = useString(resource, properties.description);
  const klass = useString(resource, properties.isA);
  switch (klass) {
    case urls.classes.collection:
      return /* @__PURE__ */ React.createElement(Table, {
        resource
      });
  }
  return /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement("h1", null, title), klass && /* @__PURE__ */ React.createElement(ClassPreview, null, "is a ", /* @__PURE__ */ React.createElement(ResourceInline, {
    url: klass
  })), description && /* @__PURE__ */ React.createElement(Markdown, {
    text: description
  }), /* @__PURE__ */ React.createElement(AllProps, {
    resource,
    except: [properties.shortname, properties.description, properties.isA]
  }));
}
const ClassPreview = styled.div`
  margin-bottom: 0.5rem;
  font-style: italic;
`;
export default ResourcePage;
