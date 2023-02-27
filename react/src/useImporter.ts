import { useEffect, useState } from 'react';
import {
  importJsonAdString as importJsonAdString,
  useResource,
  useStore,
} from './index.js';

/** Easily send JSON-AD or a URL containing it to your server. */
export function useImporter(importerUrl?: string) {
  const [url, setUrl] = useState(importerUrl);
  const [success, setSuccess] = useState(false);
  const resource = useResource(url);

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

  function importJsonAd(jsonAdString: string) {
    const parsed = new URL(importerUrl!);
    parsed.searchParams.set('json', jsonAdString);
    setUrl(parsed.toString());
  }

  return { importJsonAd, importURL, resource, success };
}
