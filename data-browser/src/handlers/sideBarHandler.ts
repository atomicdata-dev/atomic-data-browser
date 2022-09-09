import { Resource, Store, urls } from '@tomic/react';
import { isString } from '@tomic/lib';

export function buildSideBarNewResourceHandler(store: Store) {
  // When a resource is saved add it to the parents subResources list if it's not already there.
  return async (resource: Resource) => {
    const parentSubject = resource.get(urls.properties.parent);

    if (!isString(parentSubject)) {
      console.warn('Invalid parent type');

      return;
    }

    const parent = await store.getResourceAsync(parentSubject);
    const subResources = parent.getSubjects(urls.properties.subResources);

    if (subResources.includes(resource.getSubject())) {
      return;
    }

    parent.pushPropVal(urls.properties.subResources, resource.getSubject());
  };
}

export function buildSideBarRemoveResourceHandler(store: Store) {
  // When a resource is deleted remove it from the parents subResources list.
  return async (resource: Resource) => {
    const parentSubject = resource.get(urls.properties.parent);

    if (!isString(parentSubject)) {
      console.warn('Invalid parent type');

      return;
    }

    const parent = await store.getResourceAsync(parentSubject);
    const subResources = parent.getSubjects(urls.properties.subResources);

    await parent.set(
      urls.properties.subResources,
      subResources.filter(r => r !== resource.getSubject()),
      store,
    );

    parent.save(store);
  };
}
