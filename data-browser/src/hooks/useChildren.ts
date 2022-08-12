import { Store, urls, useArray, useResource, useStore } from '@tomic/react';

function buildCollectionSubject(subject: string, store: Store) {
  const url = new URL('/collections', store.serverUrl);

  url.search = new URLSearchParams({
    property: urls.properties.parent,
    value: subject,
    page_size: '100',
    total_pages: '1',
  }).toString();

  return url.toString();
}

export function useChildren(subject: string) {
  const store = useStore();
  const collection = useResource(buildCollectionSubject(subject, store));
  const [children] = useArray(collection, urls.properties.collection.members);

  return children;
}
