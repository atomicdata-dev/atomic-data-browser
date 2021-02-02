import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
//@ts-ignore
if (import.meta.hot) {
  //@ts-ignore
  import.meta.hot.accept()
}
