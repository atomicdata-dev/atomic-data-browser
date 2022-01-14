# Changelog

This changelog covers all three packages, as they are (for now) updated as a whole

## unreleased

- Make bugsnag optional #133
- Disable websockets out of browser context for `@tomic/lib`
- tauri back buttons, new tab external links #115

## v0.30.6 to 8

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
- Change default port of localhost to 9883 ([issue](https://github.com/joepio/atomic-data-rust/issues/229))

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

- Add [Typedoc documentation](https://joepio.github.io/atomic-data-browser/docs/modules.html) #100
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

- Match version number of [atomic-data-rust](https://github.com/joepio/atomic-data-rust)
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
