# Atomic-React

[![Snowpack build Status](https://github.com/joepio/atomic-react/workflows/Snowpack/badge.svg)](https://github.com/joepio/atomic-react/actions)

_status: pre-alpha_

Typescript / React library for parsing, storing and rendering [Atomic Data](https://atomicdata.dev/).
Designed for interacting with [`atomic-server`](https://github.com/joepio/atomic).

**[demo](https://joepio.github.io/atomic-react/)**

## Progress

- [x] **View data**
  - [x] Fetch atomic data
  - [x] Render atomic data
  - [x] Render properties as labels
  - [x] Datatype dependent renders
  - [x] Table view
  - [ ] Navigate collections (sorting / pagination)
- [ ] **Edit data**
  - [x] Commit implementation
  - [x] Instantiate new Resources
  - [x] Validate form fields
  - [ ] Set default agent / base server
  - [ ] Edit properties (Sign and Post Commits after editing an atom)
  - [ ] Click a property to open its form
  - [ ] Add properties to existing resource
- [ ] Resolve atomic paths
- [ ] Split up and publish as useful NPM package(s) (atomic-lib, atomic-react?)

## Running locally

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

## Deploying

- Due to a snowpack bug, we first need to go to `index.html` and rename the absolute paths to assets to `https://joepio.github.io/atomic-react/${path}`.
- publish: `yarn publish` builds & pushes to `gh-pages` branch.

## Directory structure

```
src/
- **components**: possibly re-usable components
- **helpers**: projects-specific helper functions
- **lib**: general atomic data library (higher documentation + testing goals), no react-specific code.
- **react**: general atomic data library (higher documentation + testing goals), no react-specific code.
```

## Undertanding the code

- **Styling** is done using [styled components](https://styled-components.com/). The theme settings in `Styling.tsx` desribe colors, border radius and margin size. Use these as variables in components to make sure that users can change style preferences (e.g. dark mode, accent color, font, margin size)
- **Data fetching** is handled by the `Store`, which makes sure that you don't ask twice for the same resource and let's other resources know that things have changed.
- **Hooks** are used wherever possible. This means functional components, instead of old-style Class components.
- **Routing** is done using React Router. Ultimately, the resource URL should resolve into its view in this app.
- **Document** your components and properties! Explain your thinking when doing something non-trivial.

## Contribute

Open a PR, post an issue, but most of all: [join our Discord server](https://discord.gg/a72Rv2P)!
