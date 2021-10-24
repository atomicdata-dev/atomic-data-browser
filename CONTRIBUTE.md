# Contribute

Issues and PR's are welcome!
And join our [Discord][discord-url]!

[discord-badge]: https://img.shields.io/discord/723588174747533393.svg?logo=discord
[discord-url]: https://discord.gg/a72Rv2P

## Publishing

- Install `lerna`
- `yarn build` to build typescript files (don't skip this!)
- `yarn test` (don't you publish a broken build!)
- `npm run publish` (not yarn, since that does not support publishing to npm right now). This updates the `package.json` files, creates a commit, tags it, pushes it to github, and publishes the builds to npm.
- Versions should match `atomic-data-rs`

## Understanding lerna, snowpack, yarn workspaces

This monorepo is orchestrated with lerna and yarn workspaces.
Lerna is only used for publishing and handling versions.
Yarn workspaces are used to share dependencies.
Snowpack targets `.ts` files which enables hot reload / hot module replacement, which is great for developing the data browser and the libraries at the same time.
