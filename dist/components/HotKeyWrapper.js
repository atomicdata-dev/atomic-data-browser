import * as React from "../pkg/react.js";
import {dataURL, editURL, getSubjectFromDom} from "../helpers/navigation.js";
import {useHotkeys} from "../pkg/react-hotkeys-hook.js";
import {useHistory} from "../pkg/react-router-dom.js";
function HotKeysWrapper({children}) {
  const history = useHistory();
  useHotkeys("e", () => {
    const found = getSubjectFromDom();
    found && history.push(editURL(found));
  });
  useHotkeys("d", () => {
    const found = getSubjectFromDom();
    found && history.push(dataURL(found));
  });
  useHotkeys("h", () => {
    history.push("/");
  });
  useHotkeys("n", () => {
    history.push("/new");
  });
  useHotkeys("s", () => {
    history.push("/settings");
  });
  useHotkeys("shift+/", () => {
    history.push("/shortcuts");
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
}
export default HotKeysWrapper;
