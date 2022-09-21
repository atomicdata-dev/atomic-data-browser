import { isValidURL } from '@tomic/lib';
import { useEffect, useState } from 'react';
import { isDev } from './helpers/isDev';
import { useLocalStorage, useStore } from './index';

function fixServerURL(url: string) {
  if (isDev()) {
    return url.replace('5173', '9883');
  }

  return url;
}

/**
 * A hook for using and adjusting the Server URL. Also saves to localStorage. If
 * the URL is wrong, an error is thrown using the store's handler
 */
export const useServerURL = (): [string, (serverUrl: string) => void] => {
  // Localstorage for cross-session persistence of JSON object
  const store = useStore();
  const [serverUrlJson, setServerUrlJson] = useLocalStorage<string>(
    'serverUrl',
    store.getServerUrl(),
  );
  const [serverURL, setBaseURL] = useState<string>(
    fixServerURL(window?.location.origin),
  );

  useEffect(() => {
    if (serverURL !== undefined) {
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
    serverURL && store.setServerUrl(serverURL);
  }, [serverURL]);

  return [serverURL, setServerUrlJson];
};
