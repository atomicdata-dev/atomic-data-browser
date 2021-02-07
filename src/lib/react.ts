import { useState, useEffect } from 'react';
import { Property, Store } from './store';
import React from 'react';
import { Resource } from './resource';
import { handleInfo } from '../helpers/handlers';
import { Value } from './value';
import { datatypeFromUrl } from './datatypes';
import { urls } from '../helpers/urls';
import { truncateUrl } from '../helpers/truncate';

/** Hook for getting a Resource in a React component */
export function useResource(subject: string): Resource {
  const store = useStore();
  const [resource, setResource] = useState<Resource>(store.getResource(subject));

  useEffect(() => {
    // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
    function handleNotify(updated: Resource) {
      // When a change happens, set the new Resource.
      setResource(updated);
    }
    store.subscribe(subject, handleNotify);

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      store.unsubscribe(subject, handleNotify);
    };
  }, []);

  return resource;
}

export function useProperty(subject: string): Property | null {
  const propR = useResource(subject);

  if (!propR.isReady()) {
    return null;
  }

  const datatypeUrl = propR.get(urls.properties.datatype)?.toString();
  const datatype = datatypeFromUrl(datatypeUrl);
  const shortname = propR.get(urls.properties.shortname).toString();
  const description = propR.get(urls.properties.description).toString();

  const property: Property = {
    subject,
    datatype,
    shortname,
    description,
  };
  return property;
}

export function useValue(resource: Resource, propertyURL: string): Value | null {
  if (!resource.isReady()) {
    return null;
  }
  let value = null;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return null;
  }
  return value;
}

/** Hook for getting a stringified representation of an Atom in a React component */
export function useString(resource: Resource, propertyURL: string): string | null {
  // Not sure about this...
  if (!resource.isReady()) {
    return null;
  }
  let value = undefined;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return null;
  }
  return value.toString();
}

/** Returns the most fitting title / name for a Resource */
export function useTitle(resource: Resource): string {
  const title = useString(resource, urls.properties.title);
  if (title !== null) {
    return title;
  }
  const shortname = useString(resource, urls.properties.shortname);
  if (shortname !== null) {
    return shortname;
  }
  return truncateUrl(resource.getSubject(), 40);
}

/** Hook for getting all URLs for some array */
export function useArray(resource: Resource, propertyURL: string): string[] {
  if (!resource.isReady()) {
    return [];
  }
  let value = [];
  try {
    value = resource.get(propertyURL)?.toArray();
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return [];
  }
  return value;
}

/** Hook for getting a stringified representation of an Atom in a React component */
export function useDate(resource: Resource, propertyURL: string): Date | null {
  if (!resource.isReady()) {
    return null;
  }
  let value = undefined;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return null;
  }
  try {
    return value.toDate();
  } catch (e) {
    handleInfo(e);
    return null;
  }
}

/** Preffered way of using the store in a Component. */
export function useStore(): Store {
  const store = React.useContext(StoreContext);
  if (store == undefined) {
    throw new Error(
      'Store is not found in react context. Have you wrapped your application in `<StoreContext.Provider value={new Store}>`?',
    );
  }
  return store;
}

/** The context must be provided by wrapping a high level React element in <StoreContext.Provider value={new Store}> */
export const StoreContext = React.createContext<Store>(undefined);
