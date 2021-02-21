import {useState, useEffect} from "../pkg/react.js";
import React from "../pkg/react.js";
import {ResourceStatus} from "../atomic-lib/resource.js";
import {handleInfo} from "../helpers/handlers.js";
import {Value} from "../atomic-lib/value.js";
import {datatypeFromUrl} from "../atomic-lib/datatypes.js";
import {urls} from "../helpers/urls.js";
import {truncateUrl} from "../helpers/truncate.js";
export function useResource(subject) {
  const store = useStore();
  const [resource, setResource] = useState(store.getResourceLoading(subject));
  const update = (resource2) => {
    store.addResource(resource2);
  };
  useEffect(() => {
    setResource(store.getResourceLoading(subject));
  }, [subject, store]);
  useEffect(() => {
    function handleNotify(updated) {
      setResource(updated);
    }
    store.subscribe(subject, handleNotify);
    return () => {
      store.unsubscribe(subject, handleNotify);
    };
  }, [store, subject]);
  return [resource, update];
}
export function useResources(subjects) {
  const [resources, setResources] = useState(new Map());
  const store = useStore();
  useEffect(() => {
    function handleNotify(updated) {
      resources.set(updated.getSubject(), updated);
      setResources(new Map(resources));
    }
    subjects.map((subject) => {
      const resource = store.getResourceLoading(subject);
      resources.set(subject, resource);
      setResources(new Map(resources));
      store.subscribe(subject, handleNotify);
    });
    return () => {
      subjects.map((subject) => store.unsubscribe(subject, handleNotify));
    };
  }, [subjects, resources, store]);
  return resources;
}
export function useProperty(subject) {
  const [propR] = useResource(subject);
  if (!propR.isReady()) {
    return null;
  }
  const datatypeUrl = propR.get(urls.properties.datatype)?.toString();
  const datatype = datatypeFromUrl(datatypeUrl);
  const shortname = propR.get(urls.properties.shortname).toString();
  const description = propR.get(urls.properties.description).toString();
  const classType = propR.get(urls.properties.classType)?.toString();
  const property = {
    subject,
    datatype,
    shortname,
    description,
    classType
  };
  return property;
}
export function useValue(resource, propertyURL) {
  const [val, set] = useState(null);
  const store = useStore();
  function validateAndSet(newVal, handleValidationError) {
    const valFromNewVal = new Value(newVal);
    set(valFromNewVal);
    async function setAsync() {
      try {
        await resource.setValidate(propertyURL, newVal, store);
        handleValidationError && handleValidationError(null);
      } catch (e) {
        handleValidationError && handleValidationError(e);
      }
    }
    setAsync();
  }
  if (val !== null) {
    return [val, validateAndSet];
  }
  if (!resource.isReady()) {
    return [null, validateAndSet];
  }
  let value = null;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == void 0) {
    return [null, validateAndSet];
  }
  return [value, validateAndSet];
}
export function useString(resource, propertyURL) {
  const [val, setVal] = useValue(resource, propertyURL);
  if (val == null) {
    return [null, setVal];
  }
  return [val.toString(), setVal];
}
export function useTitle(resource) {
  const [title] = useString(resource, urls.properties.name);
  const [shortname] = useString(resource, urls.properties.shortname);
  if (resource.getStatus() == ResourceStatus.loading) {
    return "...";
  }
  if (title !== null) {
    return title;
  }
  if (shortname !== null) {
    return shortname;
  }
  const subject = resource.getSubject();
  if (typeof subject == "string" && subject.length > 0) {
    return truncateUrl(subject, 40);
  }
  return subject;
}
export function useArray(resource, propertyURL) {
  const [value, set] = useValue(resource, propertyURL);
  if (value == null) {
    return [[], set];
  }
  return [value.toArray(), set];
}
export function useDate(resource, propertyURL) {
  const [value] = useValue(resource, propertyURL);
  if (value == null) {
    return null;
  }
  try {
    return value.toDate();
  } catch (e) {
    handleInfo(e);
    return null;
  }
}
export function useStore() {
  const store = React.useContext(StoreContext);
  if (store == void 0) {
    throw new Error("Store is not found in react context. Have you wrapped your application in `<StoreContext.Provider value={new Store}>`?");
  }
  return store;
}
export const StoreContext = React.createContext(void 0);
