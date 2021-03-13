import * as React from "../../pkg/react.js";
import {useArray, useResource, useStore, useString, useTitle} from "../../atomic-react/hooks.js";
import {ContainerNarrow} from "../Containers.js";
import {properties} from "../../helpers/urls.js";
import Markdown from "../datatypes/Markdown.js";
import FieldLabeled from "../forms/Field.js";
import {Button} from "../Button.js";
import {openURL} from "../../helpers/navigation.js";
import {useHistory} from "../../pkg/react-router-dom.js";
function EndpointPage({resource}) {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [parameters] = useArray(resource, properties.endpoint.parameters);
  const [virtualResource] = useResource(null);
  const store = useStore();
  const history = useHistory();
  async function constructSubject() {
    const url = new URL(resource.getSubject());
    await Promise.all(parameters.map(async (propUrl) => {
      const val = virtualResource.get(propUrl);
      if (val != null) {
        const fullprop = await store.getProperty(propUrl);
        console.log("prop", fullprop);
        url.searchParams.set(fullprop.shortname, val.toString());
      }
    }));
    history.push(openURL(url.href));
  }
  return /* @__PURE__ */ React.createElement(ContainerNarrow, {
    about: resource.getSubject()
  }, /* @__PURE__ */ React.createElement("h1", null, title, " endpoint"), description && /* @__PURE__ */ React.createElement(Markdown, {
    text: description
  }), parameters.map((param) => {
    return /* @__PURE__ */ React.createElement(FieldLabeled, {
      key: param,
      property: param,
      resource: virtualResource
    });
  }), /* @__PURE__ */ React.createElement(Button, {
    onClick: constructSubject
  }, "Open"));
}
export default EndpointPage;
