import { useEffect, useState } from 'react';

/** Watches a media query and returns a statefull result. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    queryList.addEventListener('change', listener);

    return () => queryList.removeEventListener('change', listener);
  }, []);

  return matches;
}
