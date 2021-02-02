import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import { StoreContext } from './lib/react.js';

import { Store } from './lib/store';

const store = new Store('https://surfy.ddns.net/');
store.populate();

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <App />
    </StoreContext.Provider>
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
