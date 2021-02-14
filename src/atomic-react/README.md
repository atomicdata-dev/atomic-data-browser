# Atomic-React

_note: this README is being worked on before the actual library is published as an NPM package, so modules might not resolve_

A library for viewing and creating Atomic Data.
Should be used in conjunction with `atomic-lib`.

## Setup

When initializing your App, initialize the store, which will contain all data.
Wrap your App in a `StoreContext.Provider`, and pass the newly initialized store to it.

```ts
import { StoreContext, store } from 'atomic-react';

const store = new Store();

const App = () => (
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>
);
```

Now, your Store can be accessed in React's context, which you can use the `atomic-react` hooks!

## Hooks

### useResource, useString, useTitle

```ts
// Get the Resouce, and all its properties
const [resource] = useResource('https://atomicdata.dev/classes/Agent');
// The title takes either the Title, the Shortname or the URL of the resource
const title = useTitle(resource);
// Take a property and use it as a string
const [description] = useString(resource, 'https://atomicdata.dev/properties/description');
```
