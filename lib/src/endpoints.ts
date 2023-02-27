import { Store } from './index.js';
/** Endpoints are Resources that can respond to query parameters or POST bodies */

/** POSTs a JSON-AD object to the Server */
export function importJsonAdString(
  store: Store,
  importerUrl: string,
  jsonAdString: string,
) {
  return store.postToServer(importerUrl, jsonAdString);
}
