module.exports = {
	globDirectory: '/',
	globPatterns: [
		'**/*.{ts,png,xml,ico,html,css,svg,webmanifest,js,jsx,tsx,log}',
	],
	ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
	swDest: 'public/sw.js',
};
