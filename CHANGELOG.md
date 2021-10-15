# Changelog

This changelog covers all three packges, as they are (for now) updated as a whole

## v0.26.2

- Add [Typedoc documentation](https://joepio.github.io/atomic-data-browser/docs/modules.html) #100
- Fix bug not showing resource form fields

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
