# Changelog

This changelog covers all three packages, as they are (for now) updated as a whole

## UNRELEASED

### @tomic/browser

- Move static assets around, align build with server and fix PWA #292
- Add `useChildren` hook and `Store.getChildren` method
- Add new file preview UI for images, audio, text and PDF files.
- Add new file preview types to the folder grid view.
- Fix Dialogue form #308
- Refactor search, escape query strings for Tantivy
- Add `import` context menu, allows importing anywhere

### @tomic/react

- Add more options to `useSearch`

### @tomic/lib

- Add `Store.parseMetaTags` to load JSON-AD objects stored in the DOM. Speeds up initial page load by allowing server to set JSON-AD objects in the initial HTML response.
- `store.createSubject` allows creating nested paths
- Add `Store.postToServer` method, add `endpoints`, `importJsonAdString`
- Add `store.preloadClassesAndProperties` and remove `urls.properties.getAll` and `urls.classes.getAll`. This enables using `atomic-data-browser` without relying on `atomicdata.dev` being available.
- Fix Race condition of `store.getResourceAsync` #309
- Add `buildSearchSubject` in `search.ts` which allows you to build full text search queries to send to Atomic-Server.
- Add `importJSONADString` function, allowing you to import resources from external sources.

## v0.35.0

### @tomic/react

#### Breaking changes

- Remove `initAgentFromLocalStorage()`.
- No longer save agent to local storage.

### @tomic/lib

- Add the ability to change the `fetch` function used to fetch resources over http.
- `store.addResource` is depricated in favor of `store.addResources`.
- Add `AgentChange` event on store that is fired whenever the stores agent changes.
- `store.fetchResourceFromServer` now returns the requested resource.
- Add `postCommit` method to `store` that respects the injected `fetch` function.

#### Breaking Changes:

- `uploadFiles()` has moved to `store.uploadFiles()`.
- Remove `Agent.fromJSON()`
- `tryValidURL` and `isValidURL` are now static methods on `Client` and have been renamed to `tryValidSubject` and `isValidSubject`.
- Rename `store.fetchResource` to `store.fetchResourceFromServer`.
- Rename `store.handleError` to `store.notifyError`.
- Rename `agent.checkPublicKey` to `agent.verifyPublicKeyWithServer`.
- Remove `store.errorHandler` and replace with new `StoreEvents.Error` event.

## v0.34.10

- Don't use WebSocket in Node context #280

## v0.34.9

- Fix @tomic/lib exports for non-ts contexts #270
- Fix back / forward buttons in desktop build #263
- Fix `isOffline` for node

## v0.34.0

- Add folders with list & grid views, allow drag & drop uploads #228
- Show icons in sidebar
- Add scoped search, funded by NGI NLnet Discovery #245 #254
- Make web app installable #30
- Add cookie based authentication #241
- Get rid of `useWindowSize` #256
- `canWrite` check should succeed for `publicAgent` #252
- Improve error look & text

## v0.32.1

- Lock ed25519 version #230

## v0.32.0

### Breaking changes

- Changed `null` to `undefined` in many places
- `useTitle` returns an `array` with a `setTitle` function, similar to `useState`
- `resource.getError()` is deprecated in favor or `resource.error`

### New

- Add Hierarchy in sidebar #75
- Add DriveSwitcher #209
- Add `new drive` option
- Add `EventManager` to run custom functions when resources are added / edited / etc.
- Add dialog / modal view #24 #181
- Add bookmark import / reader mode #187

### Fixes & improvements

- Stricter non-null checks, improved typings #220
- Switch from `yarn` to `pnpm` #210
- Various improvements to Dropdown forms #194
- Fix crash in circular parent rendering
- Fix race condition #189
- Make all titles editable #199
- Don't subscribe to search endpoint #200
- Refactor e2e tests
- Render floats
- Hide unsortable items in tables
- Fix dropdown resource select input #222

## v0.31.1

- Fix Dropdown input bug
- Fix autogrow textarea bug

## v0.31.0

- Add ChatRooms #153
- Improve UX for creating new Resources, instantly open new ChatRooms and Documents
- Refer to `previousCommit`s in Commits #140
- Disable websockets out of browser context for `@tomic/lib`
- Fix NPM builds for `@tomic/lib` and `@tomic/react` in non-ts environments #155
- tauri back buttons, new tab external links #115
- Fix concurrency issue with commits #91
- Make bugsnag optional #133
- Add `parseCommit` function
- Use `href` attribute in sidebar menu #148
- Use relative links in About page #149
- Show `CommitDetail` that displays audit info (creator, edit date) #145
- Prevent using `localhost` Agents for external Servers
- Implement `push`, for appending new Resources to (existing) Arrays in Commits.
- Replace snowpack with vite #156
- Use yarn v2 and replace lerna #105
- Prevent default actions for keyboard shortcuts
- Improve cross-OS keyboard shortcuts compatibility (cmd & ctrl, option & alt)
- Fix markdown being shown shortly

## v0.30.6 to 9

- Don't use WebSockets if they're not supported #131
- Fix `@noble` build issues

## v0.30.5

- Switch to `dnd-kit` for drag and drop #92
- Improved views for external resources in Documents
- Add upload dropzone to documents
- Replace `react-helmet` with `react-helmet-async`

## v0.30.4

- `@tomic/react` can now be used without `@tomic/lib` - it re-exports the library
- More performant subject updates in new resource form
- Allow `@tomic/lib` to be used in non-browser (Node) context #128
- Add `useMarkdown` function to `@tomic/react`
- Make search result previews smaller
- Fetch full collections when showing CollectionCard
- `useResource` defaults to not accepting incomplete resources
- Add `sign in` button to invite form
- Rename `baseUrl` to `serverUrl`
- Add `useServerSearch` to `@tomic/react`
- Improve UX in Tauri (desktop) mode
  - Regular Links open in your browser, instead of in Atomic

## v0.30.0

- Add File management views. Preview images and videos, download them. #121
- Add `uploadFiles` method to @tomic/lib. #121
- Add upload field to forms #121
- Fix bug resourcearray input #123
- Add WebMonetization support #124

## v0.29.2

- Add Share settings screen where you can see & edit rights / access control #113
- Add Invite form #45
- Convert Classes to typescript interfaces. Show button for this in Class view. #118
- `Create new resource` button on Drive
- Show multiple parents in breadcrumbs
- Refresh collection on opening page
- Don't auto-accept invites
- Improve server switcher design
- Change default port of localhost to 9883 ([issue](https://github.com/atomicdata-dev/atomic-data-rust/issues/229))

## v0.29.1

- Small fix

## v0.29.0

- Add authentication: sign requests, so the server knows who sent it. This allows for better authorization. #108
- Refactor Error type, improve Error page / views
- Automatically retry unauthorized resources (but I want a prettier solution, see #110)
- `useResource` no longer returns an array, but only the resource.
- Improved EndpointPage (show results, useful for Search, for example)

## v0.28.2

- Added server-side full text search #106
- Add a seperate document show page #2, improved performance in Documents
- Improved `canWrite` hook (more stable, faster)
- Improved sidebar performance (less re-renders)

## v0.28.0

- Improve styling tables and sort dropdown
- It's mostly an `atomic-server` version bump :)

## v0.27.2

- Fix setting Agent bug
- Add constructor to Store

## v0.27.1

- Include all Properties and Classes in the initial view, speeding up the app even further. #65

## v0.27.0

- Parse nested, named JSON-AD resources #98
- Refactor resource status - remove `Resource.status`, prefer `.loading` and `.error`
- Add loading and error status to Property class, include in `useProperty`
- Improve loading and error states for various components
- Refactor `store.getResourceLoading`, `store.fetchResource`, `useResource` - add option to `acceptIncomplete`.

## v0.26.2

- Add [Typedoc documentation](https://atomicdata-dev.github.io/atomic-data-browser/docs/modules.html) #100
- Fix bug not showing resource form fields
- Fix circular parent handling in `canWrite`
- Update references to changed resources #102
- Use `ws` instead of `wss` for HTTP connections

## v0.26.1

- Fix `wss` websockets
- Update typescript type exports

## v0.26.0

- Added WebSockets for live synchronization with server #80
- Add Commit parsing #80
- Custom fonts
- Prevent re-applying locally defined commits #90
- Fix race condition commits #91
- Added `opts` parameter to react hooks
- Simplify internal Value model (better performance, less bugs) #88

## v0.25.4

- Fix bugs when setting Agent, validate public key before setting
- Add integration / end to end tests #70

## v0.25.0

- Add Document editor ([demo](https://atomicdata.dev/invite/ycj661fdce8)) #2
- Improved performance and less concurrency bugs while quickly saving resources
- Improve styling (soft background on light mode)
- Add baseURL settings page + edit function in top left

## v0.24.2

- Improve resource selector dropdown, show previews, remove dependency #60
- Add toast notifications #63
- Enable `resource.save()` with custom agent
- Add JSON AD array parser
- ~~Add `default_store.json` resource to the browser to make things snappier~~ removed
- Improve type checking for value initialization and serialization types
- Improve view for nested resources

## v0.24.0

- Match version number of [atomic-data-rust](https://github.com/atomicdata-dev/atomic-data-rust)
- Add Version button to menu
- Disable menu buttons that are not usable
- Improve error view in cards
- Only show plus icon in suitable collections

## v0.0.12

### atomic-data-browser

- Fix tests
- Cleaned up Resource form #51
- Handle usages left in Invites #45
- Add social meta tags #44
- Add fetch as JSON / JSON-AD / Turtle and more to data pages
- Fix bug with invites
- Various styling improvements
- Add Atomic Data Logo
- Dark mode syncs with user
- Scroll to top on page change #47
- Improve keyboard shortcuts for edit / data view #52
- Move Agent settings to sidebar item
- Add rights check
- Change routes and settings structure
- Add Disabled state to form fields
- Improved hotkey handling
- Fix edit subject in resource form

### @tomic/react

- Resources will update when properties change (notify listeners on update)
- clean up package.json / dependencies
- Add rights check hook

### @tomic/lib

- Add `getCommitBuilder` and `hasChanges` function to `resource` and `commitBuilder`
- Add rights check to resource

## v0.0.11

- Split packages, switch to monorepo
- Publish `@tomic/lib` and `@tomic/react` libraries to npm
- Add changelog
