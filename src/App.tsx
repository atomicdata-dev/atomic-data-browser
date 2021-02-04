import React, { useState } from 'react';
import { StoreContext } from './lib/react';

import { Store } from './lib/store';
import ResourcePage from './components/ResourcePage';
import { checkValidURL } from './lib/client';
import useQueryParam from './helpers/useQueryParam';

/** Initialize the store */
const store = new Store('https://surfy.ddns.net/');
/** Add some basic resources */
store.populate();

/** Entrypoint of the application */
function App(): JSX.Element {
  const defaultSubject = 'https://atomicdata.dev/properties/description';
  // Value in the form field
  const [subjectInternal, setSubjectInternal] = useState<string>(defaultSubject);
  // Value shown in navbar, after Submitting
  const [subject, setSubject] = useQueryParam('subject', defaultSubject);
  const [error, setError] = useState<Error>(null);

  const handleSubjectChange = (subj: string) => {
    try {
      checkValidURL(subj);
      setSubjectInternal(subj);
    } catch (e) {
      setSubjectInternal(subj);
      setError(e);
      return;
    }
    setSubjectInternal(subj);
    setError(null);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSubject(subjectInternal);
  };

  return (
    // Adds the Store to the context, for Hooks
    <StoreContext.Provider value={store}>
      <div className='App'>
        <header className='App-header'>
          <form onSubmit={handleSubmit}>
            <label>
              Subject:
              <input value={subjectInternal} onChange={e => handleSubjectChange(e.target.value)} />
            </label>
            <input type='submit' value='Submit' />
          </form>
          {error !== null ? error.message : subject.length > 0 && <ResourcePage key={subject} subject={subject} />}
        </header>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
