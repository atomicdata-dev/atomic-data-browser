import React from 'react';
import { ThemeProvider } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Store } from './atomic-lib/store';
import { buildTheme, defaultColor, GlobalStyle, localStoreKeyMainColor } from './styling';
import { StoreContext } from './atomic-react/hooks';
import Browser from './components/Browser';
import New from './components/forms/New';
import { AddressBar } from './components/AddressBar';
import { useDarkMode } from './helpers/useDarkMode';
import { useLocalStorage } from './helpers/useLocalStorage';
import Settings from './components/Settings';
import { Agent } from './atomic-lib/agent';
import { getEnv, isDev, isTest } from './config';
import { handleWarning } from './helpers/handlers';
import { Edit } from './components/forms/Edit';
import HotKeysWrapper from './components/HotKeyWrapper';
import Data from './components/Data';
import { Shortcuts } from './components/Shortcuts';

/** Initialize the store */
const store = new Store();

/** Entrypoint of the application. This is where providers go. */
function App(): JSX.Element {
  const [darkMode] = useDarkMode();
  const [mainColor] = useLocalStorage(localStoreKeyMainColor, defaultColor);

  return (
    <StoreContext.Provider value={store}>
      {/* Basename is for hosting on GitHub pages */}
      <HashRouter basename='/'>
        {/* Used for getting / setting query parameters */}
        <QueryParamProvider ReactRouterRoute={Route}>
          <HotKeysWrapper>
            <ThemeProvider key={mainColor} theme={buildTheme(darkMode, mainColor)}>
              <GlobalStyle />
              <AddressBar />
              <Switch>
                <Route path='/new'>
                  <New />
                </Route>
                <Route path='/edit'>
                  <Edit />
                </Route>
                <Route path='/data'>
                  <Data />
                </Route>
                <Route path='/settings'>
                  <Settings />
                </Route>
                <Route path='/shortcuts'>
                  <Shortcuts />
                </Route>
                <Route path='/'>
                  <Browser />
                </Route>
              </Switch>
            </ThemeProvider>
          </HotKeysWrapper>
        </QueryParamProvider>
      </HashRouter>
    </StoreContext.Provider>
  );
}

export default App;

declare global {
  interface Window {
    store: Store;
  }
}

if (isDev && !isTest) {
  const agent = new Agent(getEnv('AGENT'), getEnv('PRIVATE_KEY'));
  store.setAgent(agent);
  const baseUrl = getEnv('BASE_URL');
  if (baseUrl !== undefined) {
    store.setBaseUrl(baseUrl);
  }
  handleWarning('setting agent with keys!');

  // You can access the Store from your console in dev mode!
  window.store = store;
}
