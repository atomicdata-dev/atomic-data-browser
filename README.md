# Atomic Data Browser

[![Snowpack build Status](https://github.com/joepio/atomic-data-browser/workflows/Snowpack/badge.svg)](https://github.com/joepio/atomic-data-browser/actions)

_status: alpha_

View, edit and create [Atomic Data](https://atomicdata.dev/) from your browser!
Designed for interacting with [`atomic-server`](https://github.com/joepio/atomic).

**[demo on atomicdata.dev](https://atomicdata.dev/)**

## Features

- **View data**
  - Fetch atomic data from `atomic-server` and parse [JSON-AD](https://docs.atomicdata.dev/core/json-ad.html)
  - Render [properties](https://atomicdata.dev/classes/Property) from any resource
  - Table view with sorting / pagination powered by [collections](https://atomicdata.dev/classes/Collection)
- **Edit data**
  - Create, send and sign [Atomic Commits](https://docs.atomicdata.dev/commits/intro.html)
  - Form for creating resources, include datatype validation and [Atomic Schema](https://docs.atomicdata.dev/schema/intro.html) checks
  - Add properties to existing resource
- **Other**
  - Sidebar for easy navigation
  - Dark mode, customize navbar placement and theme color
  - Accept [Atomic Invites](https://docs.atomicdata.dev/invitations.html), which generates keys and sets a new current User
  - Responsive, accessible, keyboard controls

## Running locally

```sh
# Create keys for https (required to run `window.crypto` libraries in the browser):
npx devcert-cli generate snowpack
# Rename because snowpack wants .crt
mv snowpack.cert snowpack.crt
# Install dependencies
yarn
# Run dev server
yarn start
# Build
yarn build
# Lint
yarn lint
# Test
yarn test
```

If you want to _edit_ data, you'll need an [_Agent_](https://atomicdata.dev/classes/Agent).
It's recommended fill in the .env file, and probably want to run [`atomic-server`](https://github.com/joepio/atomic/blob/master/server/README.md) using [docker](https://docs.docker.com/get-docker/).

```sh
# Create a local .env
cp template.env .env
# Run atomic-server locally, and check the logs.
docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server
# Copy the server, privatekey and agent
# Edit the newly created .env and paste in the values from above
vim .env
```

This app is a client, but has no persistent storage. Run `atomic-server`

## Understanding & contributing to the code

- **Routing** is firstly done using React Router, and secondly using the ResourcePage component. This component checks the Class of the Resource, and decides which view is most suitable. Users can open Data views and Edit forms for any resource.
- **Styling** is done using [styled components](https://styled-components.com/). The theme settings in `Styling.tsx` desribe colors, border radius and margin size. Use these as variables in components to make sure that users can change style preferences (e.g. dark mode, accent color, font, margin size)
- **Data fetching** is handled by the `Store`, which makes sure that you don't ask twice for the same resource and let's other resources know that things have changed.
- **Hooks** are used wherever possible. This means functional components, instead of old-style Class components. Hooks tend to use a pattern similar to React's own `useState`, which means that two terms are returned: the first one contains the current value, and the second one is a function for setting the value.
- **Document** your components and properties! Explain your thinking when doing something non-trivial.
- **Resources** should have a `about={subject}` tag in HTML elements / DOM nodes, which can be used for debugging and RDFa parsing. This means that you can press `e` to edit anything you're hovering on, or press `d` to show the data!
- **Accessing the store** can be done in your browser with the global `store` object. For
- **Creating views** for new types of Resources should be done in `/views`. Check the README.md in that folder.
- **Fetching & processing** is done in this order. The UI renders some component that uses `useResource`, and passes a `subject` URL. This is probably first the one that's shown in the navigation bar. This resource is fetched (unless it's already in the store) as a `JSON-AD` object, after which it is put in the Store without any changes. The Parser does not perform validation checks - that would make the application slower. After the resource is added to the store, subscribers (users of that resource, such as Components with the `useResource` hook) will be notified of changes. The component will re-render, and the props can now be used.

## Directory structure

- **components**: project specific components.
  - **datatypes**: for viewing atomic datatypes.
  - **forms**: for handling forms and form fields
- **views**: components that render specific Classes. See [the views README](src/views/README.md)
- **routes**: components that use the Router to decide what to render.
- **helpers**: projects-specific helper functions
- **atomic-lib**: general atomic data library, containing thins like a store, parsing, sending requests, the Resource model, datatype validations and creating Commits. Should not contain any react-specific code.
- **atomic-react**: generic, yet react-specific library with hooks for viewing and manipulating atomic data.
- **routes**: components that are fed into the React Router as main Routes (e.g. `/new`, `/settings`).

## Contribute

Open a PR, post an issue, but most of all: [join our Discord server](https://discord.gg/a72Rv2P)!
