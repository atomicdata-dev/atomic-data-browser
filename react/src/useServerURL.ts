import { isValidURL } from '@tomic/lib';
import { useEffect, useState } from 'react';
import { useLocalStorage, useStore } from './index';

/**
 * A hook for using and adjusting the Server URL. Also saves to localStorage. If
 * the URL is wrong, an error is thrown using the store's handler
 */
export const useServerURL = (): [string, (serverUrl: string) => void] => {
  // Localstorage for cross-session persistence of JSON object
  const store = useStore();
  const [serverUrlJson, setServerUrlJson] = useLocalStorage<string | null>(
    'serverUrl',
    store.getServerUrl(),
  );
  const [serverURL, setBaseURL] = useState<string | undefined>(
    window?.location.origin,
  );

  useEffect(() => {
    if (serverURL !== null) {
      if (isValidURL(serverUrlJson)) {
        setBaseURL(serverUrlJson);
      } else {
        store.handleError(
          new Error(
            `Invalid base URL: ${serverUrlJson}, defaulting to atomicdata.dev`,
          ),
        );
        setBaseURL('https://atomicdata.dev');
      }
    }
  }, [serverUrlJson]);

  useEffect(() => {
    store.setServerUrl(serverURL);
  }, [serverURL]);

  return [serverURL, setServerUrlJson];
};
