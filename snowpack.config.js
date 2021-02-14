/** @type {import('snowpack').SnowpackUserConfig} */
module.exports = {
  mount: {
    /* ... */
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
        // Optional: Use npm package "eslint-watch" to run on every file change
        watch: 'esw -w --clear src --ext .js,jsx,.ts,.tsx',
      },
    ],
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
    // source: 'local',
    source: 'local',
    // Used for the `crypto` node library for signing commits
    polyfillNode: true,
  },
  devOptions: {
    /* ... */
    // HTTPS is required for `window.crypto` usage
    secure: true,
  },
  buildOptions: {
    baseUrl: 'https://joepio.github.io/atomic-react/',
    /** Github requires output to this folder for static hosting on main branch */
    out: 'docs',
    metaUrlPath: `dist`,
    /* ... */
  },
};
