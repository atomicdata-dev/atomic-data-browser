import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
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

/** Initialize the store */
const store = new Store();
/** Defaulting to the current URL's origin will make sense in most non-dev environments */
store.setServerUrl(window.location.origin);
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
const ErrorBoundary = window.bugsnagApiKey
  ? initBugsnag(window.bugsnagApiKey)
  : 'div';

/** Initialize the agent from localstorage */
const agent = initAgentFromLocalStorage();
agent && store.setAgent(agent);

/** Fetch all the Properties and Classes - this helps speed up the app. */
store.fetchResource(urls.properties.getAll);
store.fetchResource(urls.classes.getAll);

if (isDev()) {
  // You can access the Store from your console in dev mode!
  window.store = store;
} else {
  // These only apply in production
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
                <ErrorBoundary FallbackComponent={CrashPage}>
                  <GlobalStyle />
                  <Toaster />
                  <MetaSetter />
                  <NavWrapper>
                    <AppRoutes />
                  </NavWrapper>
                </ErrorBoundary>
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
