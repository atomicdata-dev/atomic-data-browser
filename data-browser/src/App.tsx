import React from 'react';
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Store, Agent } from '@tomic/lib';
import { StoreContext } from '@tomic/react';
import { GlobalStyle, ThemeWrapper } from './styling';
import Show from './routes/ShowRoute';
import { Search } from './routes/SearchRoute';
import New from './routes/NewRoute';
import { NavWrapper } from './components/Navigation';
import { MetaSetter } from './components/MetaSetter';
import { SettingsTheme } from './routes/SettingsTheme';
import { getSnowpackEnv, isDev } from './config';
import { handleWarning, initBugsnag } from './helpers/handlers';
import { Edit } from './routes/EditRoute';
import HotKeysWrapper from './components/HotKeyWrapper';
import Data from './routes/DataRoute';
import { Shortcuts } from './routes/ShortcutsRoute';
import { Welcome } from './routes/WelcomeRoute';
import Local from './routes/LocalRoute';
import { AppSettingsContextProvider } from './helpers/AppSettings';
import SettingsAgent from './routes/SettingsAgent';
import { paths } from './routes/paths';
import ErrorPage from './views/ErrorPage';

/** Initialize the store */
const store = new Store();
/** Defaulting to the current URL's origin will make sense in most non-dev environments */
store.setBaseUrl(window.location.origin);
/** Setup bugsnag for error handling */
const ErrorBoundary = initBugsnag();

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
                  <MetaSetter />
                  <NavWrapper>
                    <Switch>
                      <Route path={paths.new}>
                        <New />
                      </Route>
                      <Route path={paths.themeSettings}>
                        <SettingsTheme />
                      </Route>
                      <Route path={paths.agentSettings}>
                        <SettingsAgent />
                      </Route>
                      <Route path={paths.shortcuts}>
                        <Shortcuts />
                      </Route>
                      <Route path={paths.data}>
                        <Data />
                      </Route>
                      <Route path={paths.edit}>
                        <Edit />
                      </Route>
                      <Route path={paths.show}>
                        <Show />
                      </Route>
                      <Route path={paths.search} component={Search} />
                      <Route path='/:path' component={Local} />
                      <Route path='/'>
                        <Welcome />
                      </Route>
                    </Switch>
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
    const agent = new Agent(getSnowpackEnv('AGENT'), getSnowpackEnv('PRIVATE_KEY'));
    store.setAgent(agent);
  }

  const baseUrl = getSnowpackEnv('BASE_URL');
  if (baseUrl !== undefined) {
    store.setBaseUrl(baseUrl);
    handleWarning(`Set baseURL ${baseUrl} from .env`);
  } else {
    handleWarning(`No BASE_URL found in .env, defaulting to ${store.getBaseUrl()}`);
  }

  // You can access the Store from your console in dev mode!
  window.store = store;
} else {
  // These only apply in production
}
