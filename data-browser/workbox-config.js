module.exports = {
  globDirectory: './publish',
  globPatterns: [
    '**/*.{ts,png,xml,ico,html,css,svg,webmanifest,js,jsx,tsx,log}',
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'publish/sw.js',
  modifyURLPrefix: {
    '/': '/app_assets/',
  },
  navigateFallback: 'index.html',
  mode: 'production',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          // cache fonts for 7 days
          maxAgeSeconds: 60 * 60 * 24 * 7,
          maxEntries: 30,
        },
      },
    },
  ],
};
