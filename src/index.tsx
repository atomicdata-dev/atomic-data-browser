import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import App from './App.jsx';
import { StoreContext } from './lib/react';
import { Store } from './lib/store.js';
import { ThemeProvider } from 'styled-components';
import { buildTheme } from './styling.jsx';

// Initialize the store
const store = new Store('https://surfy.ddns.net/');
// Add some basic resources
store.populate();

/** Top level React node of the Application. This is where you place wrappers / providers. */
export const Root = (): JSX.Element => (
  <React.StrictMode>
    {/* Atomic Data Store */}
    <StoreContext.Provider value={store}>
      <BrowserRouter>
        {/* Used for getting / setting query parameters */}
        <QueryParamProvider ReactRouterRoute={Route}>
          <ThemeProvider theme={buildTheme()}>
            {/* Contains actual Application logic */}
            <App />
          </ThemeProvider>
        </QueryParamProvider>
      </BrowserRouter>
    </StoreContext.Provider>
  </React.StrictMode>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
// @ts-ignore only relevant during development
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}
