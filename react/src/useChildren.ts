// Sorry for the name of this
import { properties, Resource } from '@tomic/lib';
import { useArray, useResource } from './index.js';

/** Creates a Collection and returns all children */
export const useChildren = (resource: Resource) => {
  const childrenUrl = resource.getChildrenCollection();
  const childrenCollection = useResource(childrenUrl);
  const [children] = useArray(
    childrenCollection,
    properties.collection.members,
  );

  return children;
};
