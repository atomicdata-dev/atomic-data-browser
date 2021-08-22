import { isValidURL } from '@tomic/lib';
import { useEffect, useState } from 'react';
import { useStore } from './hooks';
import { useLocalStorage } from './useLocalStorage';

/**
 * A hook for using and adjusting the Base URL. Also saves to localStorage. If
 * the URL is wrong, an error is thrown using the store's handler
 */
export const useBaseURL = (): [string, (baseURL: string) => void] => {
  // Localstorage for cross-session persistence of JSON object
  const store = useStore();
  const [baseURLJSON, setBaseURLJSON] = useLocalStorage<string | null>(
    'baseUrl',
    store.getBaseUrl(),
  );
  const [baseURL, setBaseURL] = useState<string>(window.location.origin);

  useEffect(() => {
    if (baseURL !== null) {
      if (isValidURL(baseURLJSON)) {
        setBaseURL(baseURLJSON);
      } else {
        store.handleError(
          new Error(
            `Invalid base URL: ${baseURLJSON}, defaulting to atomicdata.dev`,
          ),
        );
        setBaseURL('https://atomicdata.dev');
      }
    }
  }, [baseURLJSON]);

  useEffect(() => {
    store.setBaseUrl(baseURL);
  }, [baseURL]);

  return [baseURL, setBaseURLJSON];
};
