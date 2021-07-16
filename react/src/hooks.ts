import { useState, useEffect } from 'react';
import {
  Property,
  Store,
  Resource,
  ResourceStatus,
  JSVals,
  Value,
  Datatype,
  datatypeFromUrl,
  urls,
  truncateUrl,
  JSONValue,
} from '@tomic/lib';
import React from 'react';
import { useDebounce } from './useDebounce';

/**
 * Hook for getting and updating a Resource in a React component. Will try to
 * fetch the subject and add its parsed values to the store. Always returns a
 * Resource and a setter for a Resource, even if the input is undefined or not a
 * valid atomic URL.
 */
export function useResource(
  subject: string,
  newResource?: boolean,
): [Resource, (resource: Resource) => void] {
  const store = useStore();
  const [resource, setResource] = useState<Resource>(
    store.getResourceLoading(subject, newResource),
  );

  /** Callback function to update the Resource with this value. Overwrites existing. */
  // Not sure about this API. Perhaps useResource should return a function with a save callback that takes no arguments.
  const update = (resource: Resource) => {
    store.addResource(resource);
  };

  // If the subject changes, make sure to change the resource!
  useEffect(() => {
    setResource(store.getResourceLoading(subject, newResource));
  }, [subject, store]);

  // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
  useEffect(() => {
    function handleNotify(updated: Resource) {
      // When a change happens, set the new Resource.
      setResource(updated);
    }
    store.subscribe(subject, handleNotify);

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      store.unsubscribe(subject, handleNotify);
    };
  }, [store, subject]);

  return [resource, update];
}

/**
 * Converts an array of Atomic URL strings to an array of Resources. Could take
 * a long time.
 */
export function useResources(subjects: string[]): Map<string, Resource> {
  const [resources, setResources] = useState(new Map());
  const store = useStore();

  useEffect(() => {
    function handleNotify(updated: Resource) {
      // When a change happens, set the new Resource.
      resources.set(updated.getSubject(), updated);
      // We need to create new Maps for react hooks to update - React only checks references, not content
      setResources(new Map(resources));
    }

    // Iterate over all resources asynchronously
    subjects.map(subject => {
      const resource = store.getResourceLoading(subject);
      resources.set(subject, resource);
      setResources(new Map(resources));
      // Let the store know to call handleNotify when a resource is updated.
      store.subscribe(subject, handleNotify);
    });

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      subjects.map(subject => store.unsubscribe(subject, handleNotify));
    };
    // maybe add resources here
  }, [subjects, store]);

  return resources;
}

/**
 * Hook for using a Property. Will return null if the Property is not yet
 * loaded, and add Error strings to shortname and description if something goes wrong.
 */
export function useProperty(subject: string): Property | null {
  const [propR] = useResource(subject);

  if (!propR.isReady()) {
    if (propR.getError() !== undefined) {
      return {
        subject,
        datatype: Datatype.STRING,
        shortname: 'error',
        description: 'Error getting Property. ' + propR.getError().message,
        error: propR.getError(),
      };
    } else {
      return null;
    }
  }

  const datatypeUrl = propR.get(urls.properties.datatype)?.toString();
  const datatype = datatypeFromUrl(datatypeUrl);
  const shortname = propR.get(urls.properties.shortname).toString();
  const description = propR.get(urls.properties.description).toString();
  const classType = propR.get(urls.properties.classType)?.toString();

  const property: Property = {
    subject,
    datatype,
    shortname,
    description,
    classType,
  };
  return property;
}

/** A callback function for setting validation error messages */
type handleValidationErrorType = (
  val: JSVals,
  callback?: (e: Error) => unknown,
) => Promise<void>;

/**
 * Returns a Value (can be string, array, more or null) and a Setter. Value will
 * be null if the Resource isn't loaded yet. The setter takes two arguments -
 * the first one a native JS representation of the new value, the second one a
 * callback function for handling validation errors.
 */
export function useValue(
  resource: Resource,
  propertyURL: string,
  /** Saves the resource when the resource is changed, after 100ms */
  commit?: boolean,
): [Value | null, handleValidationErrorType] {
  const [val, set] = useState<Value>(null);
  const store = useStore();
  const subject = resource.getSubject();
  const debounced = useDebounce(val, 100);
  const [touched, setTouched] = useState(false);

  // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
  useEffect(() => {
    function handleNotify(updated: Resource) {
      // When a change happens, set the new Resource.
      set(updated.get(propertyURL));
    }
    store.subscribe(subject, handleNotify);

    return () => {
      // When the component is unmounted, unsubscribe from the store.
      store.unsubscribe(subject, handleNotify);
    };
  }, [store, resource, subject]);

  // Save the resource when the debounced value has changed
  useEffect(() => {
    // Touched prevents the resource from being saved when it is simplely changed.
    if (commit && touched) {
      try {
        resource.save(store);
        setTouched(false);
      } catch (e) {
        store.handleError(e);
      }
    }
  }, [debounced]);

  /**
   * Validates the value. If it fails, it calls the function in the second
   * Argument. Pass null to remove existing value.
   */
  async function validateAndSet(
    newVal: JSVals,
    handleValidationError?: (e: Error) => unknown,
  ): Promise<void> {
    if (newVal == null) {
      // remove the value
      resource.removePropVal(propertyURL);
      set(null);
      return;
    }
    const valFromNewVal = new Value(newVal as JSONValue);
    set(valFromNewVal);
    setTouched(true);

    /**
     * Validates and sets a property / value combination. Will invoke the
     * callback if the value is not valid.
     */
    async function setAsync() {
      try {
        await resource.set(propertyURL, newVal, store);
        handleValidationError && handleValidationError(null);
        // commit && (await resource.save(store));
        store.notify(resource);
      } catch (e) {
        handleValidationError ? handleValidationError(e) : console.log(e);
      }
    }
    await setAsync();
  }

  // If a value has already been set, return it.
  if (val !== null) {
    return [val, validateAndSet];
  }
  // When the resource isn't ready, return null
  if (!resource.isReady()) {
    return [null, validateAndSet];
  }
  let value = null;
  // Try to actually get the value, log any errorr
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    store.handleError(e);
  }
  // If it didn't work, return null to be more explicit
  if (value == undefined) {
    return [null, validateAndSet];
  }
  return [value, validateAndSet];
}

/**
 * Hook for getting and setting a stringified representation of an Atom in a
 * React component
 */
export function useString(
  resource: Resource,
  propertyURL: string,
  commit?: boolean,
): [
  string | null,
  (string: string, handleValidationErrorType?) => Promise<void>,
] {
  const [val, setVal] = useValue(resource, propertyURL, commit);
  if (val == null) {
    return [null, setVal];
  }
  return [val.toString(), setVal];
}

/** Returns the most fitting title / name for a Resource */
export function useTitle(resource: Resource, truncateLength?: number): string {
  const [title] = useString(resource, urls.properties.name);
  const [shortname] = useString(resource, urls.properties.shortname);
  // TODO: truncate non urls
  truncateLength = truncateLength ? truncateLength : 40;
  if (resource.getStatus() == ResourceStatus.loading) {
    return '...';
  }
  if (title !== null) {
    return title;
  }
  if (shortname !== null) {
    return shortname;
  }
  const subject = resource.getSubject();
  if (typeof subject == 'string' && subject.length > 0) {
    return truncateUrl(subject, 40);
  }
  return subject;
}

/**
 * Hook for getting all URLs for some array. Returns the current Array (defaults
 * to empty array) and a callback for validation errors.
 */
export function useArray(
  resource: Resource,
  propertyURL: string,
  commit?: boolean,
): [string[] | null, handleValidationErrorType] {
  const [value, set] = useValue(resource, propertyURL, commit);
  if (value == null) {
    return [[], set];
  }
  return [value.toArray(), set];
}

export function useNumber(
  resource: Resource,
  propertyURL: string,
): [number | null, handleValidationErrorType] {
  const [value, set] = useValue(resource, propertyURL);
  if (value == null) {
    return [NaN, set];
  }
  return [value.toNumber(), set];
}

/** Returns true or false. */
export function useBoolean(
  resource: Resource,
  propertyURL: string,
): [boolean | null, handleValidationErrorType] {
  const [value, set] = useValue(resource, propertyURL);
  if (value == null) {
    return [false, set];
  }
  return [value.toBoolean(), set];
}

/** Hook for getting a stringified representation of an Atom in a React component */
export function useDate(resource: Resource, propertyURL: string): Date | null {
  const store = useStore();
  const [value] = useValue(resource, propertyURL);
  if (value == null) {
    return null;
  }
  try {
    return value.toDate();
  } catch (e) {
    store.handleError(e);
    return null;
  }
}

/** Preffered way of using the store in a Component or Hook */
export function useStore(): Store {
  const store = React.useContext(StoreContext);

  if (store == undefined) {
    throw new Error(
      'Store is not found in react context. Have you wrapped your application in `<StoreContext.Provider value={new Store}>`?',
    );
  }
  return store;
}

/** Checks if the current user can edit this resource */
export function useCanWrite(
  resource: Resource,
  agent?: string,
): [boolean | null, string] {
  const store = useStore();
  const [canWrite, setCanWrite] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // If the subject changes, make sure to change the resource!
  useEffect(() => {
    if (agent == undefined) {
      setMsg('No agent set');
      setCanWrite(false);
      return;
    }
    setMsg('Checking write rights...');
    async function tryCanWrite() {
      const canWriteAsync = await resource.canWrite(store, agent);
      setCanWrite(canWriteAsync);
      if (canWriteAsync) {
        setMsg('You have the correct rights');
      } else {
        setMsg("You don't have write rights in this resource or its parents");
      }
    }
    tryCanWrite();
  }, [resource, agent]);

  return [canWrite, msg];
}

/**
 * The context must be provided by wrapping a high level React element in
 * <StoreContext.Provider value={new Store}>
 */
export const StoreContext = React.createContext<Store>(undefined);
