// eslint-disable-next-line no-undef
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
    // See https://github.com/joepio/atomic-data-browser/issues/31
    // [
    //   '@snowpack/plugin-webpack',
    //   {
    //     outputPattern: { css: '[name].css', js: '[name].js' },
    //     sourceMap: true,
    //   },
    // ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  optimize: {
    // Might be required for hosting on github pages
    bundle: true,
    minify: true,
    treeshake: true,
  },
  packageOptions: {
    source: 'local',
    // Setting source to remote should speed up development and building, but it doesn't seem to work atm. Some MIME issues.
    // source: 'remote',
    // Used for the `crypto` node library for signing commits
    polyfillNode: true,
    knownEntrypoints: ['base64 - arraybuffer'],
  },
  // Fix https://giters.com/snowpackjs/snowpack/issues/3218?amp=1
  workspaceRoot: '../',
  devOptions: {},
  buildOptions: {
    baseUrl: 'https://joepio.github.io/atomic-data-browser/',
    /** Github requires output to this folder for static hosting on main branch */
    out: 'publish',
    metaUrlPath: `dist`,
  },
};
