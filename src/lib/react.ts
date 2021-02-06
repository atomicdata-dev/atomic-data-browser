import { useState, useEffect } from 'react';
import { Property, Store } from './store';
import React from 'react';
import { Resource } from './resource';
import { handleInfo } from '../helpers/handlers';
import { Value } from './value';
import { datatypeFromUrl } from './datatypes';
import { urls } from '../helpers/urls';

/** Hook for getting a Resource in a React component */
export function useResource(subject: string): Resource | null {
  const [resource, setResource] = useState(null);
  const store = useStore();

  useEffect(() => {
    // Async code needs to be made sync
    const getResourceAsync = async () => {
      const resource = await store.getResource(subject);
      setResource(resource);
    };
    getResourceAsync();

    // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
    function handleResourceUpdated(resource: Resource) {
      // When a change happens, set the new Resource.
      setResource(resource);
    }
    store.subscribe(subject, handleResourceUpdated);

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      store.unsubscribe(subject, handleResourceUpdated);
    };
  }, []);

  return resource;
}

export function useProperty(subject: string): Property | null {
  const propR = useResource(subject);

  if (propR == null) {
    return null;
  }

  const datatype = datatypeFromUrl(propR.get(urls.properties.datatype).toString());
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

export function usePropValue(resource: Resource, propertyURL: string): Value | null {
  if (resource == undefined) {
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
export function usePropString(resource: Resource, propertyURL: string): string | null {
  // Not sure about this...
  if (resource == undefined) {
    return 'loading...';
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

/** Hook for getting all URLs for some array */
export function usePropArray(resource: Resource, propertyURL: string): string[] {
  if (resource == undefined) {
    return [];
  }
  let value = [];
  try {
    value = resource.get(propertyURL).toArray();
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return null;
  }
  return value;
}

/** Hook for getting a stringified representation of an Atom in a React component */
export function usePropDate(resource: Resource, propertyURL: string): Date | null {
  // Not sure about this...
  if (resource == undefined) {
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
