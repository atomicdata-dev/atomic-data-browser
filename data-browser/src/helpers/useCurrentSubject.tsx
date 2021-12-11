import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';

type setFunc = (latestValue: string) => void;

export function useCurrentSubjectQueryParam(): [string, setFunc] {
  return useQueryParam('subject', StringParam);
}

/**
 * Returns and sets the current Location. Tries the `subject` query parameter,
 * otherwise uses the full current URL.
 */
export function useCurrentSubject(
  /** Replace URL instead of push it, so it does not get added to history */
  replace?: boolean,
): [string | null, setFunc] {
  const [subjectQ, setSubjectQ] = useCurrentSubjectQueryParam();
  const history = useHistory();
  const { pathname, search } = useLocation();

  function handleSetSubject(subject: string) {
    const url = new URL(subject);
    if (window.location.origin == url.origin) {
      if (replace) {
        history.replace(url.pathname + url.search);
      } else {
        history.push(url.pathname + url.search);
      }
    } else {
      // TODO: Handle replace
      setSubjectQ(subject);
    }
  }
  if (subjectQ == undefined) {
    if (pathname.startsWith('/app/')) {
      return [null, handleSetSubject];
    }
    // The pathname defaults to a trailing slash, which leads to issues
    const correctedPathNamer = pathname == '/' ? '' : pathname;
    return [
      window.location.origin + correctedPathNamer + search,
      handleSetSubject,
    ];
  }
  return [subjectQ, handleSetSubject];
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
