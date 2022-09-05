import {
  Resource,
  Store,
  StoreEvents,
  urls,
  useArray,
  useResource,
  useStore,
} from '@tomic/react';
import { useEffect } from 'react';

function buildCollectionSubject(subject: string, store: Store) {
  const url = new URL('/collections', store.getServerUrl());

  url.search = new URLSearchParams({
    property: urls.properties.parent,
    value: subject,
    page_size: '100',
    total_pages: '1',
  }).toString();

  return url.toString();
}

function isCollectionSubject(subject: string, store: Store) {
  const url = new URL('/collections', store.getServerUrl());
  return subject.startsWith(url.toString());
}

function isChildOf(parentSubject: string, resource: Resource) {
  return resource.get(urls.properties.parent) === parentSubject;
}

export function useChildren(subject: string) {
  const store = useStore();

  const collecionQuerySubject = buildCollectionSubject(subject, store);

  const collection = useResource(collecionQuerySubject);
  const [children] = useArray(collection, urls.properties.collection.members);

  // Update the list of children whenever a new resource is added to the store that has this subject as its parent.
  useEffect(() => {
    return store.on(StoreEvents.NewResource, resource => {
      if (
        // Don't update if the resource is a collection query
        !isCollectionSubject(resource.getSubject(), store) &&
        isChildOf(subject, resource) &&
        !children.includes(resource.getSubject())
      ) {
        store.fetchResource(collecionQuerySubject);
      }
    });
  }, [subject, children, collecionQuerySubject]);

  // Update the list of children whenever a resource is removed from the store that has this subject as its parent.
  useEffect(() => {
    return store.on(StoreEvents.ResourceRemoved, deletedSubject => {
      if (children.includes(deletedSubject)) {
        store.fetchResource(collecionQuerySubject);
      }
    });
  }, [children]);
  return children;
}
