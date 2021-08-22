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
  - UI customization: Dark mode, navbar placement and theme color
  - Accept [Atomic Invites](https://docs.atomicdata.dev/invitations.html), which generates keys and sets a new current User
  - Responsive, accessible, keyboard controls

## Running locally

```sh
# Install dependencies
yarn
# Run dev server
yarn start
# Open browser at http://localhost:8081
```

If you want to _edit_ data, you'll need an [_Agent_](https://atomicdata.dev/classes/Agent), including its `privateKey` and `subject`.
You can get one by accepting [an Invite](https://atomicdata.dev/invites/1), or by hosting your own [`atomic-server`](https://github.com/joepio/atomic/blob/master/server/README.md).
You can set the Agent on the `/settings` route, but it's often easier to set the Agent cre
It's recommended to fill in the .env file.

```sh
# Create a local .env
cp template.env .env
# Run atomic-server locally, and check the logs.
docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server
# Copy the server, privatekey and agent
# Edit the newly created .env and paste in the values from above
vim .env
```

If you need to run locally using HTTPS:

```sh
# Create keys for https (required to run `window.crypto` libraries in the browser):
npx devcert-cli generate snowpack
# Rename because snowpack wants .crt
mv snowpack.cert snowpack.crt
# Start the server using https
yarn start-https
```

## Understanding & contributing to the code

- **Routing** is firstly done using React Router, and secondly using the ResourcePage component. This component checks the Class of the Resource, and decides which view is most suitable. Users can open Data views and Edit forms for any resource. We have some basic routes for showing, editing, and searching. Many of these routes use query parameters. The `/app` routes should be used for most app functionality, which will make the chance of having path collisions with a server smaller.
- **Styling** is done using [styled components](https://styled-components.com/). The theme settings in `Styling.tsx` desribe colors, border radius and margin size. Use these as variables in components to make sure that users can change style preferences (e.g. dark mode, accent color, font, margin size)
- **Data fetching** is handled by the `Store`, which makes sure that you don't ask twice for the same resource and let's other resources know that things have changed.
- **Hooks** are used wherever possible. This means functional components, instead of old-style Class components. Hooks tend to use a pattern similar to React's own `useState`, which means that two terms are returned: the first one contains the current value, and the second one is a function for setting the value.
- **Document** your components and properties! Explain your thinking when doing something non-trivial.
- **Resources** should have a `about={subject}` tag in HTML elements / DOM nodes, which can be used for debugging and RDFa parsing. This means that you can press `e` to edit anything you're hovering on, or press `d` to show the data!
- **Creating views** for new types of Resources should be done in `/views`. Check the README.md in that folder.
- **Fetching & processing** is done in this order. The UI renders some component that uses `useResource`, and passes a `subject` URL. This is probably first the one that's shown in the navigation bar. This resource is fetched (unless it's already in the store) as a `JSON-AD` object, after which it is put in the Store without any changes. The Parser does not perform validation checks - that would make the application slower. After the resource is added to the store, subscribers (users of that resource, such as Components with the `useResource` hook) will be notified of changes. The component will re-render, and the props can now be used.
- **Accessing the store from the browser console** can be done in develop mode in your browser with the global `store` object.
- **Forms** use the various value hooks (e.g. `useString`) for maintaining actual resource state. When the form input changes, the new value will be `.set()` on the `Resource`, and this will throw an error if there is a validation error. These should be catched by passing an error handler to the `useString` hook.

## Directory structure

- **components**: project specific components.
  - **datatypes**: for viewing atomic datatypes.
  - **forms**: for handling forms and form fields
- **views**: components that render specific Classes. See [the views README](src/views/README.md)
- **routes**: components that use the Router to decide what to render.
- **helpers**: projects-specific helper functions
- **atomic-lib**: general atomic data library, containing logic for the store, parsing, sending requests, the Resource model, datatype validations, creating Commits and more. Should not contain any react-specific code.
- **atomic-react**: generic, yet react-specific library with hooks for viewing and manipulating atomic data. Contains re-usable react specific logic.
- **routes**: components that are fed into the React Router as main Routes (e.g. `/show`, `/app/theme`).

## Testing

The tests are located in `tests` and have `.spec` in their filename.
They use the PlayWright framework and run in the browser.

- Use the `data-test` attribute in HTML elements to make playwright tests more maintainable (and prevent failing tests on changing translations)
- `yarn test` launches the E2E tests
- `yarn test-debug` launches the E2E tests in debug mode (a window opens with debug tools)
- `yarn test-new` allows you to create new tests by clicking through the app

## CI

GitHub Action is run on every used for:

- Linting (ESlint)
- Testing (in the browser, using an `atomic-server` docker image)
- Building
- Deploying to GH pages (this JS file is used by default by `atomic-server` instances)

## Contribute

Open a PR, post an issue, but most of all: [join our Discord server](https://discord.gg/a72Rv2P)!
