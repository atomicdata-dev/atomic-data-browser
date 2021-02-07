import * as React from "../pkg/react.js";
import {Container} from "./Container.js";
const Settings = () => {
  return /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement("h1", null, "Settings"), /* @__PURE__ */ React.createElement(Picker, null));
};
export default Settings;
import {HexColorPicker} from "../pkg/react-colorful.js";
import "../pkg/react-colorful/dist/index.css.proxy.js";
import {useLocalStorage} from "../helpers/useLocalStorage.js";
const Picker = () => {
  const [color, setColor] = useLocalStorage("mainColor", "#aabbcc");
  return /* @__PURE__ */ React.createElement(HexColorPicker, {
    color,
    onChange: setColor
  });
};
