import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { StoreContext } from './lib/react';

import { Store } from './lib/store';
import Resource from './components/Resource';

/** Initialize the store */
const store = new Store('https://surfy.ddns.net/');
/** Add some basic resources */
store.populate();

/** Entrypoint of the application */
function App(): JSX.Element {
  const [subject, setSubject] = useState<string>('mySubject');

  return (
    // Adds the Store to the context, for Hooks
    <StoreContext.Provider value={store}>
      <div className='App'>
        <header className='App-header'>
          <p>Enter an Atomic URL:</p>
          <input value={subject} onChange={e => setSubject(e.target.value)} />
          <ErrorBoundary>{subject.length > 0 && <Resource subject={subject} />}</ErrorBoundary>
        </header>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
