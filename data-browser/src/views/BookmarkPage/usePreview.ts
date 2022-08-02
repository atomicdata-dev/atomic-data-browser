import { Resource, Store, urls, useStore, useString } from '@tomic/react';
import React, {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { debounce } from '../../helpers/debounce';
import { useQueryString } from '../../helpers/navigation';

type UsePreviewReturnType = [
  preview: string,
  error: boolean,
  updatePreview: (websiteURL: string) => void,
];

async function fetchBookmarkData(url: string, name: string, store: Store) {
  const bookmarkRoute = new URL('/fetchbookmark', store.serverUrl);

  const searchParams = new URLSearchParams({
    name,
    url,
  });

  bookmarkRoute.search = searchParams.toString();

  const res = await fetch(bookmarkRoute.toString(), {
    headers: {
      Accept: 'application/json-ad',
    },
  });

  return await res.json();
}

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
type AtomicSetter<T> = (val: T) => Promise<void>;

const debouncedFetch = debounce(
  (
    url: string,
    name: string,
    store: Store,
    resource: Resource,
    setPreview: AtomicSetter<string>,
    setName: AtomicSetter<string>,
    setHasError: Setter<boolean>,
  ) => {
    startTransition(() => {
      fetchBookmarkData(url, name, store)
        .then(res => {
          setPreview(res.preview);
          setName(res.name);
          setHasError(false);
          resource.save(store);
        })
        .catch(err => {
          console.error(err);
          setHasError(true);
        });
    });
  },
);

export function usePreview(resource: Resource): UsePreviewReturnType {
  const store = useStore();
  const [preview, setPreview] = useString(
    resource,
    urls.properties.bookmark.preview,
  );

  const [isNew] = useQueryString('new');

  const [url] = useString(resource, urls.properties.bookmark.url);
  const [name, setName] = useString(resource, urls.properties.name);

  const [hasError, setHasError] = useState(false);

  const update = useCallback(
    (websiteURL: string) => {
      try {
        new URL(websiteURL);
      } catch (e) {
        return;
      }

      debouncedFetch(
        websiteURL,
        name,
        store,
        resource,
        setPreview,
        setName,
        setHasError,
      );
    },
    [name, resource, store],
  );

  useEffect(() => {
    if (isNew === 'true') {
      update(url);
    }
  }, [isNew]);

  return [preview, hasError, update];
}
