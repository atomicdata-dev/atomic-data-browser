import React from 'react';

import { Store } from './lib';

function App() {
  let store = new Store("https://surfy.ddns.net/");

  return (
    <div className="App">
      <header className="App-header">
        {store.greet()}
      </header>
    </div>
  );
}

export default App;
