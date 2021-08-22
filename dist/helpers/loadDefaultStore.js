import {parseJsonADArray} from "../link/lib/src/index.js";
import default_store from "../default_store.json";
export function loadDefaultStore(store) {
  const resources = parseJsonADArray(default_store);
  for (const resource of resources) {
    store.addResource(resource);
  }
}
