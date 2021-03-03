import React from "../pkg/react.js";
import {useHistory} from "../pkg/react-router-dom.js";
import {newURL} from "../helpers/navigation.js";
import {useResource, useTitle} from "../atomic-react/hooks.js";
import {Button} from "./Button.js";
function NewIntanceButton({klass, subtle}) {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();
  return /* @__PURE__ */ React.createElement(Button, {
    onClick: () => history.push(newURL(klass)),
    subtle
  }, "new ", title);
}
export default NewIntanceButton;
