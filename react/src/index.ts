/**
 * # @tomic/react Documentation
 *
 * Render, fetch, edit and delete [Atomic Data](https://atomicdata.dev).
 *
 * ## How to use
 *
 * - Add `@tomic/react` and `@tomic/lib` to your `package.json` `dependencies`.
 * - Start by initializing `const store = new Store()` form `@tomic/lib`.
 * - Wrap your React application in a `<StoreContext.Provider value={store}>` component.
 * - Add `useResource` and `use<Datatype>` hooks to your React components.
 * - Add User and session management using the `useCurrentAgent` hook
 *
 * For example usage, see [this CodeSandbox
 * template](https://codesandbox.io/s/atomic-data-react-template-4y9qu?file=/src/MyResource.tsx:304-388).
 *
 * @module
 */

export * from './hooks';
export * from './useCollection';
export * from './useBaseURL';
export * from './useCurrentAgent';
export * from './useLocalStorage';
