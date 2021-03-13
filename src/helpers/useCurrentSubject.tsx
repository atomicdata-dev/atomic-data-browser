import { useState } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';

type setFunc = (newValue: string | ((latestValue: string) => string), updateType?: 'replace' | 'push' | 'replaceIn' | 'pushIn') => void;

export function useCurrentSubject(): [string, setFunc] {
  const [subjectQ, setSubjectQ] = useQueryParam('subject', StringParam);
  if (subjectQ == undefined) {
    return [window.location.href, setSubjectQ];
  }
  return [subjectQ, setSubjectQ];
}

/** Hook for getting and setting a query param from the current Subject */
export function useSubjectParam(key: string): [string, (string) => void] {
  const [subject, setSubject] = useCurrentSubject();
  const params = new URL(subject).searchParams;
  const [val, setValInternal] = useState(params.get(key));

  function setVal(newVal: string | null) {
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
