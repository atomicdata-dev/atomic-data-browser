/**
 * # @tomic/react Documentation
 *
 * Render, fetch, edit and delete [Atomic Data](https://atomicdata.dev).
 * Re-exports all of [`@tomic/lib`](https://www.npmjs.com/package/@tomic/lib).
 *
 * [github repository](https://github.com/atomicdata-dev/atomic-data-browser)
 *
 * ## How to use
 *
 * - Add [`@tomic/react`](https://www.npmjs.com/package/@tomic/react) and to your
 *   `package.json` `dependencies`.
 * - Start by initializing a {@link Store}`const store = new Store()` form `@tomic/lib`.
 * - Wrap your React application in a `<StoreContext.Provider value={store}>` component.
 * - Add {@link useResource} and {@link useValue} hooks (e.g. {@link useArray}) to
 *   your React components.
 * - Add User and session management using the {@link useCurrentAgent} hook
 *
 * For example usage, see [this CodeSandbox
 * template](https://codesandbox.io/s/atomic-data-react-template-4y9qu?file=/src/MyResource.tsx:304-388).
 *
 * @module
 */

export * from './hooks';
export * from './useBaseURL';
export * from './useCurrentAgent';
export * from './useDebounce';
export * from './useLocalStorage';
export * from './useMarkdown';
export * from './useServerSearch';
export * from '@tomic/lib';
