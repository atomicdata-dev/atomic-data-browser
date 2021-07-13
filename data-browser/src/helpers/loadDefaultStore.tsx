import { parseJsonADArray, Store } from '@tomic/lib';
import default_store from '../default_store.json';

/** Adds the default Atomic Data resources to the store */
export function loadDefaultStore(store: Store): void {
  const resources = parseJsonADArray(default_store);
  for (const resource of resources) {
    store.addResource(resource);
  }
}
