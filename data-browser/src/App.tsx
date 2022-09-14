import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import {
  initAgentFromLocalStorage,
  StoreContext,
  Store,
  urls,
} from '@tomic/react';

import { GlobalStyle, ThemeWrapper } from './styling';
import { AppRoutes } from './routes/Routes';
import { NavWrapper } from './components/Navigation';
import { MetaSetter } from './components/MetaSetter';
import { Toaster } from './components/Toaster';
import { isDev } from './config';
import { handleError, initBugsnag } from './helpers/handlers';
import HotKeysWrapper from './components/HotKeyWrapper';
import { AppSettingsContextProvider } from './helpers/AppSettings';
import CrashPage from './views/CrashPage';
import toast from 'react-hot-toast';
import { DialogContainer } from './components/Dialog/DialogContainer';
import { registerHandlers } from './handlers';
import { ErrorBoundary } from './views/ErrorPage';

/** Initialize the store */
const store = new Store();
/**
 * Defaulting to the current URL's origin will make sense in most non-dev environments.
 * In dev envs, we want to default to port 9883
 */
const currentOrigin = window.location.origin;
store.setServerUrl(
  currentOrigin === 'http://localhost:3000'
    ? 'http://localhost:9883'
    : currentOrigin,
);

/** Show an error when things go wrong */
store.errorHandler = e => {
  handleError(e);

  if (e.message.length > 100) {
    e.message = e.message.substring(0, 100) + '...';
  }

  toast.error(e.message);
};

declare global {
  interface Window {
    bugsnagApiKey: string;
  }
}
/** Setup bugsnag for error handling, but only if there's an API key */
const ErrBoundary = window.bugsnagApiKey
  ? initBugsnag(window.bugsnagApiKey)
  : ErrorBoundary;

/** Initialize the agent from localstorage */
const agent = initAgentFromLocalStorage();
agent && store.setAgent(agent);

/** Fetch all the Properties and Classes - this helps speed up the app. */
store.fetchResource(urls.properties.getAll);
store.fetchResource(urls.classes.getAll);

// Register global event handlers.
registerHandlers(store);

if (isDev()) {
  // You can access the Store from your console in dev mode!
  window.store = store;
}

/** Entrypoint of the application. This is where providers go. */
function App(): JSX.Element {
  return (
    <StoreContext.Provider value={store}>
      <AppSettingsContextProvider>
        <HelmetProvider>
          {/* Basename is for hosting on GitHub pages */}
          <BrowserRouter basename='/'>
            <HotKeysWrapper>
              <ThemeWrapper>
                <ErrBoundary FallbackComponent={CrashPage}>
                  {/* @ts-ignore TODO: Check if types are fixed or upgrade styled-components to 6.0.0 */}
                  <GlobalStyle />
                  <Toaster />
                  <MetaSetter />
                  <DialogContainer>
                    <NavWrapper>
                      <AppRoutes />
                    </NavWrapper>
                  </DialogContainer>
                </ErrBoundary>
              </ThemeWrapper>
            </HotKeysWrapper>
          </BrowserRouter>
        </HelmetProvider>
      </AppSettingsContextProvider>
    </StoreContext.Provider>
  );
}

export default App;

declare global {
  interface Window {
    store: Store;
  }
}
