import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter, Route } from 'react-router-dom';
import { Store, urls } from '@tomic/lib';
import { StoreContext } from '@tomic/react';

import { GlobalStyle, ThemeWrapper } from './styling';
import { Routes } from './routes/Routes';
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
store.setBaseUrl(window.location.origin);
/** Show an error when things go wrong */
store.errorHandler = e => {
  handleError(e);
  if (e.message.length > 100) {
    e.message = e.message.substring(0, 100) + '...';
  }
  toast.error(e.message);
};
/** Setup bugsnag for error handling */
const ErrorBoundary = initBugsnag();
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
        {/* Basename is for hosting on GitHub pages */}
        <BrowserRouter basename='/'>
          <QueryParamProvider ReactRouterRoute={Route}>
            <HotKeysWrapper>
              <ThemeWrapper>
                <ErrorBoundary FallbackComponent={CrashPage}>
                  <GlobalStyle />
                  <Toaster />
                  <MetaSetter />
                  <NavWrapper>
                    <Routes />
                  </NavWrapper>
                </ErrorBoundary>
              </ThemeWrapper>
            </HotKeysWrapper>
          </QueryParamProvider>
        </BrowserRouter>
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
