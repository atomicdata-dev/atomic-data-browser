import {useState} from "../pkg/react.js";
import {StringParam, useQueryParam} from "../pkg/use-query-params.js";
export function useCurrentSubject() {
  const [subjectQ, setSubjectQ] = useQueryParam("subject", StringParam);
  if (subjectQ == void 0) {
    return [window.location.href, setSubjectQ];
  }
  return [subjectQ, setSubjectQ];
}
export function useSubjectParam(key) {
  const [subject, setSubject] = useCurrentSubject();
  const params = new URL(subject).searchParams;
  const [val, setValInternal] = useState(params.get(key));
  function setVal(newVal) {
    params.set(key, newVal);
    const newUrl = new URL(subject);
    newUrl.searchParams.set(key, newVal);
    if (newVal == null) {
      newUrl.searchParams.delete(key);
    }
    setValInternal(newVal);
    setSubject(newUrl.href);
  }
  return [val, setVal];
}
