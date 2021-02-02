import React from 'react';

import { Store } from './lib/store';

const store = new Store('https://surfy.ddns.net/');
store.populate();

function App(): void {
  return (
    <div className='App'>
      <header className='App-header'>{store.getResource('mySubject').get('myProp').toString()}</header>
    </div>
  );
}

export default App;
