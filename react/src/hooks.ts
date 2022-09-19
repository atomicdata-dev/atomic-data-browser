import { useState, useEffect, useCallback } from 'react';
import {
  Property,
  Store,
  Resource,
  Datatype,
  datatypeFromUrl,
  urls,
  truncateUrl,
  JSONValue,
  valToBoolean,
  valToNumber,
  valToDate,
  valToArray,
  valToString,
  FetchOpts,
  unknownSubject,
} from '@tomic/lib';
import React from 'react';
import { useDebounce } from './index';

/**
 * Hook for getting a Resource in a React component. Will try to fetch the
 * subject and add its parsed values to the store.
 */
export function useResource(
  subject: string = unknownSubject,
  opts?: FetchOpts,
): Resource {
  const store = useStore();
  const [resource, setResource] = useState<Resource>(
    store.getResourceLoading(subject, opts),
  );

  // If the subject changes, make sure to change the resource!
  useEffect(() => {
    setResource(store.getResourceLoading(subject, opts));
  }, [subject, store]);

  // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
  useEffect(() => {
    function handleNotify(updated: Resource) {
      // When a change happens, set the new Resource.
      setResource(updated);
    }

    if (subject) {
      store.subscribe(subject, handleNotify);

      return () => {
        // Unsubscribe from the store when next useEffect is called or the component is unmounted.
        store.unsubscribe(subject, handleNotify);
      };
    }
  }, [store, subject]);

  return resource;
}

/**
 * Converts an array of Atomic URL strings to an array of Resources. Could take
 * a long time.
 */
export function useResources(
  subjects: string[],
  opts: FetchOpts = {},
): Map<string, Resource> {
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
      const resource = store.getResourceLoading(subject, opts);
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
export function useProperty(subject: string): Property {
  const propertyResource = useResource(subject);

  if (propertyResource.loading) {
    return {
      subject,
      datatype: Datatype.UNKNOWN,
      shortname: 'loading',
      description: `Loading property ${subject}`,
      loading: true,
    };
  }

  if (propertyResource.error) {
    return {
      subject,
      datatype: Datatype.UNKNOWN,
      shortname: 'error',
      description: 'Error getting Property. ' + propertyResource.error.message,
      error: propertyResource.getError(),
    };
  }

  const datatypeUrl = propertyResource.get(urls.properties.datatype) as string;
  const datatype = datatypeFromUrl(datatypeUrl);
  const shortname = propertyResource.get(urls.properties.shortname) as string;
  const description = propertyResource.get(
    urls.properties.description,
  ) as string;
  const classType = propertyResource.get(urls.properties.classType) as string;
  const isDynamic = !!propertyResource.get(
    urls.properties.isDynamic,
  ) as boolean;

  const property: Property = {
    subject,
    datatype,
    shortname,
    description,
    classType,
    isDynamic,
  };

  return property;
}

type setValue = (val: JSONValue) => Promise<void>;

/** Extra options for useValue hooks, mostly related to commits and validation */
type useValueOptions = {
  /**
   * Sends a Commit to the server when the value is changed. Disabled by
   * default. If this is false, you will need to manually call Resource.save()
   * to save changes
   */
  commit?: boolean;
  /**
   * Performs datatype validation. Enabled by default, but this could cause some
   * slowdown when the first validation is done as the Property needs to be
   * present in the store, and might have to be fetched
   */
  validate?: boolean;
  /** Amount of milliseconds to wait (debounce) before applying Commit. Defaults to 100. */
  commitDebounce?: number;
  /**
   * A callback function that will be called when the validation fails. For
   * example, pass a `setError` function. If you want to remove the Error, return `undefined`.
   */
  handleValidationError?: (e: Error | undefined) => unknown;
};

/**
 * Similar to React's `useState` hook. Returns a Value and a Setter as an array
 * of two items. Value will be null if the Resource isn't loaded yet. The
 * generated Setter function can be called to set the value. Be sure to look at
 * the various options for useValueOptions (debounce, commits, error handling).
 *
 * ```typescript
 * // Simple usage:
 * const resource = useResource('https://atomicdata.dev/classes/Agent');
 * const [shortname, setShortname] = useValue(
 *   'https://atomicdata.dev/properties/shortname',
 *   resource,
 * );
 * ```
 *
 * ```typescript
 * // With options:
 * const resource = useResource('https://atomicdata.dev/classes/Agent');
 * const [error, setError] = useState(null);
 * const [shortname, setShortname] = useValue(
 *   'https://atomicdata.dev/properties/shortname',
 *   resource,
 *   {
 *     commit: true,
 *     validate: true,
 *     commitDebounce: 500,
 *     handleValidationError: setError,
 *   },
 * );
 * ```
 */
export function useValue(
  resource: Resource,
  propertyURL: string,
  /** Saves the resource when the resource is changed, after 100ms */
  opts: useValueOptions = {},
): [JSONValue | null, setValue] {
  const {
    commit = false,
    validate = true,
    commitDebounce = 100,
    handleValidationError,
  } = opts;
  const [val, set] = useState<JSONValue>(null);
  const store = useStore();
  const debounced = useDebounce(val, commitDebounce);
  const [touched, setTouched] = useState(false);

  // Try without this
  // When a component mounts, it needs to let the store know that it will subscribe to changes to that resource.
  // useEffect(() => {
  //   function handleNotify(updated: Resource) {
  //     // When a change happens, set the new Resource.
  //     set(updated.get(propertyURL));
  //   }
  //   store.subscribe(subject, handleNotify);

  //   return () => {
  //     // When the component is unmounted, unsubscribe from the store.
  //     store.unsubscribe(subject, handleNotify);
  //   };
  // }, [store, resource, subject]);

  // Save the resource when the debounced value has changed
  useEffect(() => {
    // Touched prevents the resource from being saved when it is loaded (and not changed)
    if (commit && touched) {
      setTouched(false);
      resource.save(store, store.getAgent()).catch(e => store.handleError(e));
    }
  }, [JSON.stringify(debounced)]);

  /**
   * Validates the value. If it fails, it calls the function in the second
   * Argument. Pass null to remove existing value.
   */
  const validateAndSet = useCallback(
    async (newVal: JSONValue): Promise<void> => {
      if (newVal === null) {
        // remove the value
        resource.removePropVal(propertyURL);
        set(null);

        return;
      }

      set(newVal);
      setTouched(true);

      /**
       * Validates and sets a property / value combination. Will invoke the
       * callback if the value is not valid.
       */
      async function setAsync() {
        try {
          await resource.set(propertyURL, newVal, store, validate);
          handleValidationError && handleValidationError(undefined);
          // Clone resource to force hooks to re-evaluate due to shallow comparison.
          store.notify(resource.clone());
        } catch (e) {
          if (handleValidationError) {
            handleValidationError(e);
          } else {
            store.handleError(e);
          }
        }
      }

      await setAsync();
    },
    [resource, handleValidationError, store, validate],
  );

  // If a value has already been set, return it.
  if (val !== null) {
    return [val, validateAndSet];
  }

  // Value hasn't been set in state yet, so get the value
  let value: JSONValue = null;

  // Try to actually get the value, log any errorr
  try {
    value = resource.get(propertyURL);

    if (resource.getSubject().startsWith('http://localhost/sear')) {
      // eslint-disable-next-line no-console
      console.error('useValue', val, resource.getSubject());
    }
  } catch (e) {
    store.handleError(e);
  }

  // If it didn't work, return null to be more explicit
  if (value === undefined || value === null) {
    return [null, validateAndSet];
  }

  return [value, validateAndSet];
}

/**
 * Hook for getting and setting a stringified representation of an Atom in a
 * React component. See {@link useValue}
 */
export function useString(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): [string | undefined, (string: string) => Promise<void>] {
  const [val, setVal] = useValue(resource, propertyURL, opts);

  if (!val) {
    return [undefined, setVal];
  }

  return [valToString(val), setVal];
}

export const noNestedSupport =
  'error:no_support_for_editing_nested_resources_yet';

/**
 * Hook for getting and setting a Subject. Converts Nested resources into paths.
 * See {@link useValue} for more info on using the `set` functionality.
 */
export function useSubject(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): [string | null, (string: string) => Promise<void>] {
  const [val, setVal] = useValue(resource, propertyURL, opts);

  if (!val) {
    return [null, setVal];
  }

  if (typeof val === 'string') {
    return [val, setVal];
  } else {
    // It's a nested resource
    // TODO: Implement support for this. Get the subject from the Resource, or construct te Path.
    return [noNestedSupport, setVal];
  }
}

const titleHookOpts: useValueOptions = {
  commit: true,
};

/**
 * Returns the most fitting title / name for a Resource. This is either the
 * Name, Shortname, Filename or truncated Subject URL of that resource.
 */
export function useTitle(
  resource: Resource,
  truncateLength = 40,
): [string, (string: string) => Promise<void>] {
  const [name, setName] = useString(
    resource,
    urls.properties.name,
    titleHookOpts,
  );
  const [shortname, setShortname] = useString(
    resource,
    urls.properties.shortname,
    titleHookOpts,
  );
  const [filename, setFileName] = useString(
    resource,
    urls.properties.file.filename,
    titleHookOpts,
  );

  if (resource.loading) {
    return ['...', setName];
  }

  if (name !== undefined) {
    return [name, setName];
  }

  if (shortname !== undefined) {
    return [shortname, setShortname];
  }

  if (filename !== undefined) {
    return [filename, setFileName];
  }

  const subject = resource?.getSubject();

  if (typeof subject === 'string' && subject.length > 0) {
    return [truncateUrl(subject, truncateLength), setName];
  }

  return [subject, setName];
}

/**
 * Hook for getting all URLs for some array. Returns the current Array (defaults
 * to empty array) and a callback for validation errors. See {@link useValue}
 */
export function useArray(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): [string[], setValue] {
  const [value, set] = useValue(resource, propertyURL, opts);

  if (value === null) {
    return [[], set];
  }

  // If .toArray() errors, return an empty array. Useful in forms when datatypes haves changed!
  // https://github.com/atomicdata-dev/atomic-data-browser/issues/85
  let arr: string[] = [];

  try {
    // This cast isn't entirely correct - we should add a `useSubjects` hook.
    // https://github.com/atomicdata-dev/atomic-data-browser/issues/219
    arr = valToArray(value) as string[];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e, value, propertyURL, resource.getSubject());
  }

  return [arr, set];
}

/** See {@link useValue} */
export function useNumber(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): [number | null, setValue] {
  const [value, set] = useValue(resource, propertyURL, opts);

  if (value === null) {
    return [NaN, set];
  }

  return [valToNumber(value), set];
}

/** Returns false if there is no value for this propertyURL. See {@link useValue} */
export function useBoolean(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): [boolean | null, setValue] {
  const [value, set] = useValue(resource, propertyURL, opts);

  if (value === null) {
    return [false, set];
  }

  return [valToBoolean(value), set];
}

/**
 * Hook for getting a stringified representation of an Atom in a React
 * component. See {@link useValue}
 */
export function useDate(
  resource: Resource,
  propertyURL: string,
  opts?: useValueOptions,
): Date | null {
  const store = useStore();
  const [value] = useValue(resource, propertyURL, opts);

  if (value === null) {
    return null;
  }

  try {
    return valToDate(value);
  } catch (e) {
    store.handleError(e);

    return null;
  }
}

/** Preferred way of using the store in a Component or Hook */
export function useStore(): Store {
  const store = React.useContext(StoreContext);

  if (store === undefined) {
    throw new Error(
      'Store is not found in react context. Have you wrapped your application in `<StoreContext.Provider value={new Store}>`?',
    );
  }

  return store;
}

/**
 * Checks if the Agent has the appropriate rights to edit this resource. If you
 * don't explicitly pass an Agent URL, it will select the current Agent set by the store.
 */
export function useCanWrite(
  resource: Resource,
  agent?: string,
): [canWrite: boolean | null, message: string | null] {
  const store = useStore();
  const [canWrite, setCanWrite] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const agentStore = store.getAgent();

  // If the subject changes, make sure to change the resource!
  useEffect(() => {
    if (agent === undefined) {
      agent = agentStore?.subject;
    }

    if (agent === undefined) {
      setMsg('No Agent set');
      setCanWrite(false);

      return;
    }

    if (resource.new) {
      setCanWrite(true);

      return;
    }

    setMsg('Checking write rights...');

    async function tryCanWrite() {
      const [canWriteAsync, canWriteMsg] = await resource.canWrite(
        store,
        agent,
      );
      setCanWrite(canWriteAsync);

      if (canWriteAsync) {
        setMsg(null);
      } else {
        setMsg(
          ("You don't have write rights in this resource or its parents: " +
            canWriteMsg) as string,
        );
      }
    }

    tryCanWrite();
  }, [resource, agent, agentStore?.subject]);

  return [canWrite, msg];
}

/**
 * The context must be provided by wrapping a high level React element in
 * `<StoreContext.Provider value={new Store}>My App</StoreContext.Provider>`
 */
export const StoreContext = React.createContext<Store>(new Store());
