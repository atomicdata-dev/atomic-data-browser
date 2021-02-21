import {StringParam, useQueryParam} from "../pkg/use-query-params.js";
export function useCurrentSubject() {
  return useQueryParam("subject", StringParam);
}
