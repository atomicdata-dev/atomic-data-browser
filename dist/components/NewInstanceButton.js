import React from "../pkg/react.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {newURL} from "../helpers/navigation.js";
import {useResource, useTitle} from "../atomic-react/hooks.js";
import {ButtonMargin} from "./Button.js";
function NewIntanceButton({klass}) {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(ButtonMargin, {
    type: "button",
    onClick: () => history.push(newURL(klass))
  }, "new ", title);
}
export default NewIntanceButton;
