import * as React from "../../_snowpack/pkg/react.js";
import {StringParam, useQueryParam} from "../../_snowpack/pkg/use-query-params.js";
import {AddressBar} from "./AddressBar.js";
import ResourcePage from "./ResourcePage.js";
import {Welcome} from "./Welcome.js";
const Browser = () => {
  const [subject] = useQueryParam("subject", StringParam);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AddressBar, null), subject ? /* @__PURE__ */ React.createElement(ResourcePage, {
    key: subject,
    subject
  }) : /* @__PURE__ */ React.createElement(Welcome, null));
};
export default Browser;
