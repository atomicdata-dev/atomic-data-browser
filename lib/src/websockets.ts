import { parseAndApply } from './commit';
import { Store } from './store';

/** Opens a Websocket Connection at `/ws` for the current Drive */
export function startWebsocket(store: Store): WebSocket {
  console.log('starting websocket with', store.getBaseUrl());
  const wsURL = new URL(store.getBaseUrl());
  wsURL.protocol = 'ws';
  wsURL.pathname = '/ws';
  const client = new WebSocket(wsURL.toString());
  client.onopen = _e => handleOpen(store);
  client.onmessage = (ev: MessageEvent) => handleMessage(ev, store);
  client.onerror = handleError;
  client.onclose = handleClose;
  console.log('starting websocket...', client);
  return client;
}

function handleOpen(store: Store) {
  // TODO: Add a way to subscribe to multiple resources in one request
  for (const subject of store.subscribers.keys()) {
    store.subscribeWebSocket(subject);
  }
}

function handleMessage(ev: MessageEvent, store: Store) {
  console.log('message', ev.data);
  if (ev.data.startsWith('COMMIT ')) {
    const commit = ev.data.slice(7);
    parseAndApply(commit, store);
  } else {
    console.warn('Unknown websocket message:', ev);
  }
}

function handleError(ev: Event) {
  console.log('websocket error:', ev);
}

function handleClose(ev: CloseEvent) {
  console.log('websocket close:', ev);
}
