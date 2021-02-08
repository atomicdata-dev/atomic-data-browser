import React from 'react';
import { ThemeProvider } from 'styled-components';

import { Store } from './lib/store';
import { QueryParamProvider } from 'use-query-params';
import { buildTheme, GlobalStyle } from './styling';
import { StoreContext } from './lib/react';
import { BrowserRouter, Route } from 'react-router-dom';
import Browser from './components/Browser';

/** Initialize the store */
const store = new Store('https://surfy.ddns.net/');

/** Entrypoint of the application. This is where providers go. */
function App(): JSX.Element {
  return (
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        {/* Used for getting / setting query parameters */}
        <QueryParamProvider ReactRouterRoute={Route}>
          <ThemeProvider theme={buildTheme()}>
            <GlobalStyle />
            <Browser />
          </ThemeProvider>
        </QueryParamProvider>
      </BrowserRouter>
    </StoreContext.Provider>
  );
}

export default App;
