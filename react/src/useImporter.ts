import { useEffect, useState } from 'react';
import {
  import_json_ad_string as importJsonAdString,
  useResource,
  useStore,
} from './index.js';

/** Easily send JSON-AD or a URL containing it to your server. */
export function useImporter(importerUrl?: string) {
  const [url, setUrl] = useState(importerUrl);
  const [success, setSuccess] = useState(false);
  const resource = useResource(url);
  const store = useStore();

  // Get the error from the resource
  useEffect(() => {
    if (resource.error) {
      setSuccess(false);
    } else {
      // Only if the resource has a query parameter, it's likely that it imported something
      if (url?.includes('?') && resource.isReady()) {
        setSuccess(true);
      }
    }
  }, [resource]);

  function importURL(jsonAdUrl: string) {
    const parsed = new URL(importerUrl!);
    parsed.searchParams.set('url', jsonAdUrl);
    setUrl(parsed.toString());
  }

  async function importJsonAd(jsonAdString: string) {
    if (!importerUrl) {
      throw Error('No importer URL given');
    }

    try {
      const resp = await importJsonAdString(store, importerUrl, jsonAdString);

      if (resp.error) {
        throw resp.error;
      }
    } catch (e) {
      store.notifyError(e);
      setSuccess(false);
    }
  }

  return { importJsonAd, importURL, resource, success };
}
