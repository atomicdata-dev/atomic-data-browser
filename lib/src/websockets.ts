import { createAuthentication } from './authentication.js';
import {
  parseAndApplyCommit,
  parseJsonADResource,
  Resource,
  Store,
  unknownSubject,
} from './index.js';

/** Opens a Websocket Connection at `/ws` for the current Drive */
export function startWebsocket(url: string, store: Store): WebSocket {
  const wsURL = new URL(url);

  // Default to a secure WSS connection, but allow WS for unsecured server connections
  if (wsURL.protocol === 'http:') {
    wsURL.protocol = 'ws';
  } else {
    wsURL.protocol = 'wss';
  }

  wsURL.pathname = '/ws';
  const client = new WebSocket(wsURL.toString());
  client.onopen = _e => handleOpen(store, client);
  client.onmessage = (ev: MessageEvent) => handleMessage(ev, store);
  client.onerror = handleError;

  // client.onclose = handleClose;
  return client;
}

function handleOpen(store: Store, client: WebSocket) {
  // Make sure user is authenticated before sending any messages
  authenticate(client, store).then(() => {
    // Subscribe to all existing messages
    // TODO: Add a way to subscribe to multiple resources in one request
    for (const subject of store.subscribers.keys()) {
      store.subscribeWebSocket(subject);
    }
  });
}

function handleMessage(ev: MessageEvent, store: Store) {
  if (ev.data.startsWith('COMMIT ')) {
    const commit = ev.data.slice(7);
    parseAndApplyCommit(commit, store);
  } else if (ev.data.startsWith('ERROR ')) {
    store.handleError(ev.data.slice(6));
  } else if (ev.data.startsWith('RESOURCE ')) {
    const resourceJSON: string = ev.data.slice(9);
    const parsed = JSON.parse(resourceJSON);
    const newResource = new Resource(unknownSubject);
    parseJsonADResource(parsed, newResource, store);
  } else {
    console.warn('Unknown websocket message:', ev);
  }
}

function handleError(ev: Event) {
  console.error('websocket error:', ev);
}

/**
 * Authenticates current Agent over current WebSocket. Doesn't do anything if
 * there is no agent
 */
export async function authenticate(client: WebSocket, store: Store) {
  const agent = store.getAgent();

  if (!agent) {
    return;
  }

  if (
    !client.url.startsWith('ws://localhost:') &&
    agent?.subject?.startsWith('http://localhost')
  ) {
    console.warn("Can't authenticate localhost Agent over websocket");

    return;
  }

  const json = await createAuthentication(client.url, agent);
  client.send('AUTHENTICATE ' + JSON.stringify(json));
}

/** Sends a GET message for some resource over websockets. */
export async function fetchWebSocket(client: WebSocket, subject: string) {
  client.send('GET ' + subject);
}
