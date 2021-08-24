import { Store } from './store';

/** Opens a Websocket Connection at `/ws` for the current Drive */
export function startWebsocket(store: Store): WebSocket {
  console.log('starting websocket with', store.getBaseUrl());
  const wsURL = new URL(store.getBaseUrl());
  wsURL.protocol = 'ws';
  wsURL.pathname = '/ws';
  const client = new WebSocket(wsURL.toString());
  client.onopen = _e => handleOpen(store);
  client.onmessage = handleMessage;
  client.onerror = handleError;
  client.onclose = handleClose;
  console.log('starting websocket...', client);
  return client;
}

function handleOpen(store: Store) {
  for (const subject in store.subscribers) {
    store.subscribeWebSocket(subject);
  }
  console.log('websocket opened');
}

function handleMessage(ev: MessageEvent) {
  console.log('websocket message:', ev);
}

function handleError(ev: Event) {
  console.log('websocket error:', ev);
}

function handleClose(ev: CloseEvent) {
  console.log('websocket close:', ev);
}
