import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter, Route } from 'react-router-dom';
import { Store, Agent } from '@tomic/lib';
import { StoreContext } from '@tomic/react';

import { GlobalStyle, ThemeWrapper } from './styling';
import { Routes } from './routes/Routes';
import { NavWrapper } from './components/Navigation';
import { MetaSetter } from './components/MetaSetter';
import { Toaster } from './components/Toaster';
import { getSnowpackEnv, isDev } from './config';
import { handleWarning, initBugsnag } from './helpers/handlers';
import HotKeysWrapper from './components/HotKeyWrapper';
import { AppSettingsContextProvider } from './helpers/AppSettings';
import ErrorPage from './views/ErrorPage';
import toast from 'react-hot-toast';

/** Initialize the store */
const store = new Store();
/** Defaulting to the current URL's origin will make sense in most non-dev environments */
store.setBaseUrl(window.location.origin);
/** Show an error when things go wrong */
store.errorHandler = e => toast.error(e.message);
/** Setup bugsnag for error handling */
const ErrorBoundary = initBugsnag();
/**
 * Load the Atomic Data default properties and classes to speed things up
 * Currently does not work properly
 */
// loadDefaultStore(store);

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
                <ErrorBoundary FallbackComponent={ErrorPage}>
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

if (isDev()) {
  // These only apply in dev mode
  const agentSubject = getSnowpackEnv('AGENT');
  const agentPrivateKey = getSnowpackEnv('PRIVATE_KEY');
  if (agentSubject && agentPrivateKey) {
    handleWarning(`Setting agent ${agentSubject} with privateKey from .env`);
    const agent = new Agent(
      getSnowpackEnv('AGENT'),
      getSnowpackEnv('PRIVATE_KEY'),
    );
    store.setAgent(agent);
  }

  const baseUrl = getSnowpackEnv('BASE_URL');
  if (baseUrl !== undefined) {
    store.setBaseUrl(baseUrl);
    handleWarning(`Set baseURL ${baseUrl} from .env`);
  } else {
    handleWarning(
      `No BASE_URL found in .env, defaulting to ${store.getBaseUrl()}`,
    );
  }

  // You can access the Store from your console in dev mode!
  window.store = store;
} else {
  // These only apply in production
}
