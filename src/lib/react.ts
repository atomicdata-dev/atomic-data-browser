import { useState, useEffect } from 'react';
import { Resource, Store } from './store';
import React from 'react';

export function useResource(subject: string): Resource {
  const [resource, setResource] = useState(null);
  const store = useStore();

  useEffect(async () => {
    const resource = await store.getResource(subject);
    setResource(resource);

    function handleResourceUpdated(resource: Resource) {
      console.log('resource updated!');
      setResource(resource);
    }

    store.subscribe(subject, handleResourceUpdated);
    return () => {
      store.unsubscribe(subject, handleResourceUpdated);
    };
  });

  return resource;
}

export function useStore(): Store {
  return React.useContext(StoreContext);
}

export const StoreContext = React.createContext<Store>(undefined!);
