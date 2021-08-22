import { Store } from './store';

/** Opens a Websocket Connection at `/ws` for the current Drive */
export function startWebsocket(store: Store): WebSocket {
  console.log(store.getBaseUrl());
  const wsURL = new URL(store.getBaseUrl());
  wsURL.protocol = 'ws';
  wsURL.pathname = '/ws';
  const client = new WebSocket(wsURL.toString());
  client.onopen = handleOpen;
  client.onmessage = handleMessage;
  client.onerror = handleError;
  client.onclose = handleClose;
  console.log('starting websocket...', client);
  return client;
}

function handleOpen(e: Event) {
  console.log('websocket opened', e);
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
