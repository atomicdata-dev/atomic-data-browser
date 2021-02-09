import { useState, useEffect } from 'react';
import { Property, Store } from './store';
import React from 'react';
import { Resource } from './resource';
import { handleError, handleInfo } from '../helpers/handlers';
import { Value } from './value';
import { datatypeFromUrl } from './datatypes';
import { urls } from '../helpers/urls';
import { truncateUrl } from '../helpers/truncate';

/** Hook for getting a Resource in a React component */
export function useResource(subject: string): [Resource, (resource: Resource) => void] {
  const store = useStore();
  const [resource, setResource] = useState<Resource>(store.getResource(subject));

  /** Update the Resource with this value. Overwrites existing. */
  // Not sure about this API. Perhaps useResource should return a function with a save callback that takes no arguments.
  const update = (resource: Resource) => {
    store.addResource(resource);
  };

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

  return [resource, update];
}

export function useProperty(subject: string): Property | null {
  const [propR] = useResource(subject);

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

/** Hook for getting and setting a stringified representation of an Atom in a React component */
export function useString(resource: Resource, propertyURL: string): [string | null, (string: string, handleValidationError?) => void] {
  const [val, set] = useState(null);
  const store = useStore();

  /** Validates the value. If it fails, it calls the function in the second Argument. */
  function validateAndSet(newVal: string, handleValidationError?: (e: Error) => any) {
    set(newVal);

    async function setAsyn() {
      try {
        await resource.setValidate(propertyURL, newVal, store);
        handleValidationError(null);
      } catch (e) {
        handleValidationError(e);
      }
    }
    setAsyn();
  }

  if (val !== null) {
    return [val, validateAndSet];
  }
  if (!resource.isReady()) {
    return [null, validateAndSet];
  }
  let value = undefined;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == undefined) {
    return [null, validateAndSet];
  }
  // set(value.toString());
  return [value.toString(), validateAndSet];
}

/** Returns the most fitting title / name for a Resource */
export function useTitle(resource: Resource): string {
  const [title] = useString(resource, urls.properties.name);
  const [shortname] = useString(resource, urls.properties.shortname);
  if (title !== null) {
    return title;
  }
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
