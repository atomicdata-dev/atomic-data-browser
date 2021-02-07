import React from "../../_snowpack/pkg/react.js";
import {StringParam, useQueryParam} from "../../_snowpack/pkg/use-query-params.js";
import {useStore} from "../lib/react.js";
function Link({children, url}) {
  const [, setSubject] = useQueryParam("subject", StringParam);
  const store = useStore();
  store.fetchResource(url);
  const handleClick = (e) => {
    e.preventDefault();
    setSubject(url);
  };
  return /* @__PURE__ */ React.createElement("a", {
    onClick: handleClick,
    href: url
  }, children);
}
export default Link;
