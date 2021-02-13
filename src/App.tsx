import React from 'react';
import { ThemeProvider } from 'styled-components';
import { QueryParamProvider } from 'use-query-params';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Store } from './atomic-lib/store';
import { buildTheme, defaultColor, GlobalStyle, localStoreKeyMainColor } from './styling';
import { StoreContext } from './atomic-react/hooks';
import Browser from './components/Browser';
import New from './components/New';
import { AddressBar } from './components/AddressBar';
import { useDarkMode } from './helpers/useDarkMode';
import { useLocalStorage } from './helpers/useLocalStorage';
import Settings from './components/Settings';
import { Agent } from './atomic-lib/agent';
import { getEnv, isDev } from './config';
import { handleWarning } from './helpers/handlers';

/** Initialize the store */
const store = new Store('http://localhost');

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
          <ThemeProvider key={mainColor} theme={buildTheme(darkMode, mainColor)}>
            <GlobalStyle />
            <AddressBar />
            <Switch>
              <Route path='/new'>
                <New />
              </Route>
              <Route path='/settings'>
                <Settings />
              </Route>
              <Route path='/'>
                <Browser />
              </Route>
            </Switch>
          </ThemeProvider>
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

if (isDev) {
  const agent = new Agent(getEnv('AGENT'), getEnv('PRIVATE_KEY'));
  store.setAgent(agent);
  handleWarning('setting agent with keys!');

  // You can access the Store from your console in dev mode!
  window.store = store;
}
