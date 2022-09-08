import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryString } from './navigation';

type setFunc = (latestValue: string) => void;

/**
 * Returns and sets the current Location. Tries the `subject` query parameter,
 * otherwise uses the full current URL.
 */
export function useCurrentSubject(
  /** Replace URL instead of push it, so it does not get added to history */
  replace?: boolean,
): [string | undefined, setFunc] {
  const [subjectQ, setSubjectQ] = useQueryString('subject');
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  function handleSetSubject(subject: string) {
    const url = new URL(subject);

    if (window.location.origin === url.origin) {
      if (replace) {
        navigate(url.pathname + url.search, { replace: true });
      } else {
        navigate(url.pathname + url.search);
      }
    } else {
      // TODO: Handle replace?
      setSubjectQ(subject);
    }
  }

  if (subjectQ === '') {
    if (pathname.startsWith('/app/')) {
      return [undefined, handleSetSubject];
    }

    // The pathname defaults to a trailing slash, which leads to issues
    const correctedPathNamer = pathname === '/' ? '' : pathname;

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
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (subject) {
      setParams(new URL(subject).searchParams);
    } else {
      setParams(null);
    }
  }, [subject]);

  function setVal(newVal: string | null) {
    params.set(key, newVal);
    const newUrl = new URL(subject);
    newUrl.searchParams.set(key, newVal);

    if (newVal === null || newVal === '') {
      newUrl.searchParams.delete(key);
    }

    setSubject(newUrl.href);
  }

  return [params?.get(key), setVal];
}
