import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.jsx';

/**
 * Top level React node of the Application. Keep this one empty (no providers),
 * as the Testing library imports the App component
 */
export const Root = (): JSX.Element => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.render(<Root />, document.getElementById('root'));
