import React from "./pkg/react.js";
import {ThemeProvider} from "./pkg/styled-components.js";
import {QueryParamProvider} from "./pkg/use-query-params.js";
import {BrowserRouter, Route, Switch} from "./pkg/react-router-dom.js";
import {Store} from "./atomic-lib/store.js";
import {buildTheme, defaultColor, GlobalStyle, localStoreKeyMainColor} from "./styling.js";
import {StoreContext} from "./atomic-react/hooks.js";
import Show from "./routes/Show.js";
import New from "./routes/New.js";
import {AddressBar} from "./components/AddressBar.js";
import {useDarkMode} from "./helpers/useDarkMode.js";
import {useLocalStorage} from "./helpers/useLocalStorage.js";
import Settings from "./routes/Settings.js";
import {Agent} from "./atomic-lib/agent.js";
import {getSnowpackEnv, isDev} from "./config.js";
import {handleWarning} from "./helpers/handlers.js";
import {Edit} from "./routes/Edit.js";
import HotKeysWrapper from "./components/HotKeyWrapper.js";
import Data from "./routes/Data.js";
import {Shortcuts} from "./routes/Shortcuts.js";
import {Welcome} from "./routes/Welcome.js";
import Local from "./routes/Local.js";
const store = new Store();
function App() {
  const [darkMode] = useDarkMode();
  const [mainColor] = useLocalStorage(localStoreKeyMainColor, defaultColor);
  return /* @__PURE__ */ React.createElement(StoreContext.Provider, {
    value: store
  }, /* @__PURE__ */ React.createElement(BrowserRouter, {
    basename: "/"
  }, /* @__PURE__ */ React.createElement(QueryParamProvider, {
    ReactRouterRoute: Route
  }, /* @__PURE__ */ React.createElement(HotKeysWrapper, null, /* @__PURE__ */ React.createElement(ThemeProvider, {
    key: mainColor,
    theme: buildTheme(darkMode, mainColor)
  }, /* @__PURE__ */ React.createElement(GlobalStyle, null), /* @__PURE__ */ React.createElement(AddressBar, null), /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/new"
  }, /* @__PURE__ */ React.createElement(New, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/edit"
  }, /* @__PURE__ */ React.createElement(Edit, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/data"
  }, /* @__PURE__ */ React.createElement(Data, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/settings"
  }, /* @__PURE__ */ React.createElement(Settings, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/shortcuts"
  }, /* @__PURE__ */ React.createElement(Shortcuts, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/show"
  }, /* @__PURE__ */ React.createElement(Show, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/:path"
  }, /* @__PURE__ */ React.createElement(Local, null)), /* @__PURE__ */ React.createElement(Route, {
    path: "/"
  }, /* @__PURE__ */ React.createElement(Welcome, null))))))));
}
export default App;
if (isDev()) {
  const agentSubject = getSnowpackEnv("AGENT");
  const agentPrivateKey = getSnowpackEnv("PRIVATE_KEY");
  if (agentSubject && agentPrivateKey) {
    handleWarning(`Setting agent ${agentSubject} with privateKey from .env`);
    const agent = new Agent(getSnowpackEnv("AGENT"), getSnowpackEnv("PRIVATE_KEY"));
    store.setAgent(agent);
  } else {
    handleWarning(`No AGENT and PRIVATE_KEY found in .env, Agent not set.`);
  }
  const baseUrl = getSnowpackEnv("BASE_URL");
  if (baseUrl !== void 0) {
    store.setBaseUrl(baseUrl);
    handleWarning(`Set baseURL ${baseUrl} from .env`);
  } else {
    handleWarning(`No BASE_URL found in .env, defaulting to https://atomicdata.dev.`);
  }
  window.store = store;
}
