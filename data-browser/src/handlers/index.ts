import { Store, StoreEvents } from '@tomic/react';
import {
  buildSideBarNewResourceHandler,
  buildSideBarRemoveResourceHandler,
} from './sideBarHandler';

export function registerHandlers(store: Store) {
  store.on(
    StoreEvents.ResourceManuallyCreated,
    buildSideBarNewResourceHandler(store),
  );
  store.on(
    StoreEvents.ResourceRemoved,
    buildSideBarRemoveResourceHandler(store),
  );
}
