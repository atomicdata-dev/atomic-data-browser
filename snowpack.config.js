/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'eslint src --ext .js,jsx,.ts,.tsx',
        // "eslint-watch" to run on every file change
        watch: 'esw -w --clear src --ext .js,jsx,.ts,.tsx',
      },
    ],
    // Snowpack can build for production, but WebPack does more optimizations
    // Throws an error atm, enable later
    // '@snowpack/plugin-webpack',
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    minify: true,
    target: 'es2020',
  },
  packageOptions: {
    source: 'local',
    // Setting source to remote should speed up development and building, but it doesn't seem to work atm. Some MIME issues.
    // source: 'remote',
    // Used for the `crypto` node library for signing commits
    polyfillNode: true,
  },
  devOptions: {},
  buildOptions: {
    baseUrl: 'https://joepio.github.io/atomic-react/',
    /** Github requires output to this folder for static hosting on main branch */
    out: 'docs',
    metaUrlPath: `dist`,
  },
};
