import { createAuthentication, Agent, Store } from '@tomic/react';

const ONE_HOUR = 60 * 60 * 1000;

export const setCookie = (name: string, value: string) => {
  const expiry = new Date(Date.now() + ONE_HOUR).toISOString();
  const encodedValue = encodeURIComponent(value);

  document.cookie = `${name}=${encodedValue};expires=${expiry}; path=/`;
};

export const setCookieAuthentication = (store: Store, agent: Agent) => {
  createAuthentication(store.getServerUrl(), agent).then(auth => {
    setCookie('atomic_session', btoa(JSON.stringify(auth)));
  });
};
