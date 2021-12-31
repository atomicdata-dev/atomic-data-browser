import { parseAndApply } from './commit';
import { Store } from './store';

/** Opens a Websocket Connection at `/ws` for the current Drive */
export function startWebsocket(store: Store): WebSocket {
  const wsURL = new URL(store.getServerUrl());
  // Default to a secure WSS connection, but allow WS for unsecured server connections
  if (wsURL.protocol == 'http:') {
    wsURL.protocol = 'ws';
  } else {
    wsURL.protocol = 'wss';
  }
  wsURL.pathname = '/ws';
  const client = new WebSocket(wsURL.toString());
  client.onopen = _e => handleOpen(store);
  client.onmessage = (ev: MessageEvent) => handleMessage(ev, store);
  client.onerror = handleError;
  // client.onclose = handleClose;
  return client;
}

function handleOpen(store: Store) {
  // TODO: Add a way to subscribe to multiple resources in one request
  for (const subject of store.subscribers.keys()) {
    store.subscribeWebSocket(subject);
  }
}

function handleMessage(ev: MessageEvent, store: Store) {
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

// function handleClose(ev: CloseEvent) { }
