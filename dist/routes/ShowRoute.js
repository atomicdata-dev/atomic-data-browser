import * as React from "../pkg/react.js";
import {checkValidURL} from "../atomic-lib/client.js";
import ResourcePage from "../components/ResourcePage.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
import {Search} from "./SearchRoute.js";
import {Welcome} from "./WelcomeRoute.js";
const Show = () => {
  const [subject] = useCurrentSubject();
  if (subject == void 0 || subject == "") {
    return /* @__PURE__ */ React.createElement(Welcome, null);
  }
  try {
    checkValidURL(subject);
    return /* @__PURE__ */ React.createElement(ResourcePage, {
      key: subject,
      subject
    });
  } catch (e) {
    return /* @__PURE__ */ React.createElement(Search, {
      query: subject
    });
  }
};
export default Show;
