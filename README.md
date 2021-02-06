# Atomic-React

_status: very pre-alpha, stay away from this_

An example app for interacting with [`atomic-server`](https://github.com/joepio/atomic).
Goal: Edit an [Atomic Resource](https://docs.atomicdata.dev/core/concepts.html) from a browser!

## Progress

- [x] Fetch atomic data
- [x] Render atomic data
- [x] Render properties as labels
- [x] Some styling
- [x] Datatype dependent renders
- [ ] Navigate collections (sorting / pagination)
- [ ] Set default agent (private key)
- [ ] Click a property to open its form
- [ ] Validate form fields
- [ ] Sign and Post Commits after editing a field
- [ ] Publish as useful NPM package(s)

## Usage

Run using `npx`:

```
npx snowpack dev
```

Or `yarn` / `npm`:

```sh
yarn
yarn dev
yarn build
```

## Linting

`yarn prettier --write .`

## Testing

`yarn test`

## Directory structure

```
- **components**: possibly re-usable components
- **helpers**: projects-specific helper functions
- **lib**: general atomic data library (higher documentation + testing goals), no react-specific code.
```
