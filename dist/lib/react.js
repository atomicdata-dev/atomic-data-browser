import {useState, useEffect} from "../pkg/react.js";
import React from "../pkg/react.js";
import {handleInfo} from "../helpers/handlers.js";
import {datatypeFromUrl} from "./datatypes.js";
import {urls} from "../helpers/urls.js";
import {truncateUrl} from "../helpers/truncate.js";
export function useResource(subject) {
  const store = useStore();
  const [resource, setResource] = useState(store.getResource(subject));
  useEffect(() => {
    function handleNotify(updated) {
      setResource(updated);
    }
    store.subscribe(subject, handleNotify);
    return () => {
      store.unsubscribe(subject, handleNotify);
    };
  }, []);
  return resource;
}
export function useProperty(subject) {
  const propR = useResource(subject);
  if (!propR.isReady()) {
    return null;
  }
  const datatypeUrl = propR.get(urls.properties.datatype)?.toString();
  const datatype = datatypeFromUrl(datatypeUrl);
  const shortname = propR.get(urls.properties.shortname).toString();
  const description = propR.get(urls.properties.description).toString();
  const property = {
    subject,
    datatype,
    shortname,
    description
  };
  return property;
}
export function useValue(resource, propertyURL) {
  if (!resource.isReady()) {
    return null;
  }
  let value = null;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == void 0) {
    return null;
  }
  return value;
}
export function useString(resource, propertyURL) {
  if (!resource.isReady()) {
    return null;
  }
  let value = void 0;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == void 0) {
    return null;
  }
  return value.toString();
}
export function useTitle(resource) {
  console.log("resource", resource);
  console.log("status", resource.getStatus());
  const title = useString(resource, urls.properties.title);
  if (title !== null) {
    return title;
  }
  const shortname = useString(resource, urls.properties.shortname);
  console.log("shortname", shortname);
  if (shortname !== null) {
    return shortname;
  }
  return truncateUrl(resource.getSubject(), 40);
}
export function useArray(resource, propertyURL) {
  if (!resource.isReady()) {
    return [];
  }
  let value = [];
  try {
    value = resource.get(propertyURL)?.toArray();
  } catch (e) {
    handleInfo(e);
  }
  if (value == void 0) {
    return [];
  }
  return value;
}
export function useDate(resource, propertyURL) {
  if (!resource.isReady()) {
    return null;
  }
  let value = void 0;
  try {
    value = resource.get(propertyURL);
  } catch (e) {
    handleInfo(e);
  }
  if (value == void 0) {
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
