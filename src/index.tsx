import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import App from './App.jsx';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <App />
      </QueryParamProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
// @ts-ignore only relevant during development
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
}
