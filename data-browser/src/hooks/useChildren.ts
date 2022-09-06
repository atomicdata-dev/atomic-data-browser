import {
  Resource,
  StoreEvents,
  urls,
  useArray,
  useResource,
  useServerURL,
  useStore,
} from '@tomic/react';
import { useEffect, useState } from 'react';

function buildCollectionSubject(subject: string, serverURL: string) {
  const url = new URL('/collections', serverURL);

  url.search = new URLSearchParams({
    property: urls.properties.parent,
    value: subject,
    page_size: '100',
  }).toString();

  console.log(url.toString());
  return url.toString();
}

function isChildOf(parentSubject: string, resource: Resource) {
  return resource.get(urls.properties.parent) === parentSubject;
}

export function useChildren(subject: string) {
  const store = useStore();
  const [serverURL] = useServerURL();

  const [collecionQuerySubject, setCollectionQuerySubject] = useState(
    buildCollectionSubject(subject, serverURL),
  );

  const collection = useResource(collecionQuerySubject);
  const [children] = useArray(collection, urls.properties.collection.members);

  const isResourceRelevant = (resource: Resource) =>
    isChildOf(subject, resource) || children.includes(resource.getSubject());

  useEffect(() => {
    const newSubject = buildCollectionSubject(subject, serverURL);
    setCollectionQuerySubject(newSubject);
  }, [serverURL]);

  // Update the list of children whenever a new resource is added to the store that has this subject as its parent.
  useEffect(() => {
    return store.on(StoreEvents.ResourceSaved, resource => {
      if (isResourceRelevant(resource)) {
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

  if (collection.error) {
    // throw collection.error;
  }
  return children;
}
