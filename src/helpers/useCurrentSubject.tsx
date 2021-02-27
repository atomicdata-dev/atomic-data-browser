import { StringParam, useQueryParam } from 'use-query-params';

type setFunc = (newValue: string | ((latestValue: string) => string), updateType?: 'replace' | 'push' | 'replaceIn' | 'pushIn') => void;

export function useCurrentSubject(): [string, setFunc] {
  return useQueryParam('subject', StringParam);
}

/** Hook for getting and setting a query param from the current Subject */
export function useSubjectParam(key: string): [string, (string) => void] {
  const [subject, setSubject] = useCurrentSubject();
  const params = new URLSearchParams(subject);
  const val = params.get(key);

  function setVal(newVal: string) {
    params.set(key, newVal);
    const newUrl = new URL(subject);
    newUrl.searchParams.append(key, newVal);
    setSubject(newUrl.href);
  }

  return [val, setVal];
}
