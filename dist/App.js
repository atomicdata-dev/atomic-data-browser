import React from "../_snowpack/pkg/react.js";
import {ThemeProvider} from "../_snowpack/pkg/styled-components.js";
import {Store} from "./lib/store.js";
import {QueryParamProvider} from "../_snowpack/pkg/use-query-params.js";
import {buildTheme, GlobalStyle} from "./styling.js";
import {StoreContext} from "./lib/react.js";
import {BrowserRouter, Route} from "../_snowpack/pkg/react-router-dom.js";
import Browser from "./components/Browser.js";
const store = new Store("https://surfy.ddns.net/");
function App() {
  return /* @__PURE__ */ React.createElement(StoreContext.Provider, {
    value: store
  }, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(QueryParamProvider, {
    ReactRouterRoute: Route
  }, /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: buildTheme()
  }, /* @__PURE__ */ React.createElement(GlobalStyle, null), /* @__PURE__ */ React.createElement(Browser, null)))));
}
export default App;
