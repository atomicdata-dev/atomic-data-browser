import React from 'react'

import { Store } from './lib/store'

let store = new Store('https://surfy.ddns.net/')
store.populate()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {store.getResource('mySubject').get('myProp').toString()}
      </header>
    </div>
  )
}

export default App
