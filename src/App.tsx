import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { StoreContext } from './lib/react';

import { Store } from './lib/store';
import ResourcePage from './components/ResourcePage';
import { checkValidURL } from './lib/client';

/** Initialize the store */
const store = new Store('https://surfy.ddns.net/');
/** Add some basic resources */
store.populate();

/** Entrypoint of the application */
function App(): JSX.Element {
  const [subject, setSubject] = useState<string>('https://example.com/mySubject');
  const [error, setError] = useState<Error>(null);

  const handleSubjectChange = (subject: string) => {
    try {
      checkValidURL(subject);
      setSubject(subject);
    } catch (e) {
      setSubject(subject);
      setError(e);
      return;
    }
    setSubject(subject);
    setError(null);
  };

  return (
    // Adds the Store to the context, for Hooks
    <StoreContext.Provider value={store}>
      <div className='App'>
        <header className='App-header'>
          <p>Enter an Atomic URL:</p>
          <input value={subject} onChange={e => handleSubjectChange(e.target.value)} />
          {error !== null ? error.message : <ErrorBoundary>{subject.length > 0 && <ResourcePage subject={subject} />}</ErrorBoundary>}
        </header>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
