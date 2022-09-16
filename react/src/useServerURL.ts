import { isValidURL } from '@tomic/lib';
import { useCallback } from 'react';
import { isDev } from './helpers/isDev';
import { useLocalStorage, useStore } from './index';

function fixDevUrl(url: string) {
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
  const [serverUrl, setServerUrl] = useLocalStorage<string>(
    'serverUrl',
    store.getServerUrl() ?? fixDevUrl(window?.location.origin),
  );

  const set = useCallback(
    (value: string) => {
      if (!value) {
        return;
      }

      let newValue = 'https://atomicdata.dev';

      if (isValidURL(value)) {
        newValue = value;
      } else {
        store.handleError(
          new Error(`Invalid base URL: ${value}, defaulting to atomicdata.dev`),
        );
      }

      setServerUrl(newValue);
      store.setServerUrl(newValue);
    },
    [store],
  );

  return [serverUrl, set];
};
