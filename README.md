# Atomic-React

_status: pre-alpha_

Typescript / React library for parsing, storing and rendering [Atomic Data](https://atomicdata.dev/).
Designed for interacting with [`atomic-server`](https://github.com/joepio/atomic).

**[demo](https://joepio.github.io/atomic-react/)**

## Progress

- [x] Fetch atomic data
- [x] Render atomic data
- [x] Render properties as labels
- [x] Some styling
- [x] Datatype dependent renders
- [x] Commit implementation
- [ ] Set default agent / base server
- [ ] Edit properties (Sign and Post Commits after editing an atom)
- [ ] Click a property to open its form
- [ ] Validate form fields
- [x] Table view
- [ ] Navigate collections (sorting / pagination)
- [ ] Instantiate new Resources
- [ ] Add properties
- [ ] Resolve atomic paths
- [ ] Split up and publish as useful NPM package(s) (atomic-lib, atomic-react?)

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

- lint: `yarn prettier --write .`
- test: `yarn test`
- publish: `yarn publish` builds & pushes to `gh-pages` branch.

## Directory structure

```
- **components**: possibly re-usable components
- **helpers**: projects-specific helper functions
- **lib**: general atomic data library (higher documentation + testing goals), no react-specific code.
```

## Contribute

Open a PR, post an issue, but most of all: [join our Discord server](https://discord.gg/a72Rv2P)!
