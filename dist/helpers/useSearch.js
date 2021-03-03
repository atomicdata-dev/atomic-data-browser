import React from "../pkg/react.js";
import {useStore} from "../atomic-react/hooks.js";
import {QuickScore} from "../pkg/quick-score.js";
import {urls} from "./urls.js";
export const useSearch = () => {
  const store = useStore();
  const [index, setIndex] = React.useState(null);
  React.useEffect(() => {
    const index2 = constructIndex(store);
    setIndex(index2);
  }, [store]);
  return index;
};
function constructIndex(store) {
  const resourceMap = store.resources;
  const subjectArray = Array.from(resourceMap.values());
  const dataArray = subjectArray.map((resource) => {
    if (!resource.isReady())
      return "";
    if (resource.getClasses().includes(urls.classes.commit)) {
      return "";
    }
    const propvalsString = JSON.stringify(Array.from(resource.getPropVals().values()).sort().join(" \n "));
    const searchResource = {
      subject: resource.getSubject(),
      valuesArray: propvalsString
    };
    return searchResource;
  });
  const qsOpts = {keys: ["subject", "valuesArray"]};
  const qs = new QuickScore(dataArray, qsOpts);
  return qs;
}
