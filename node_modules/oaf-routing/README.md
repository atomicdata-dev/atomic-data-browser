[![Build Status](https://travis-ci.org/oaf-project/oaf-routing.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-routing)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Foaf-project%2Foaf-routing%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/oaf-project/oaf-routing.svg)](https://lgtm.com/projects/g/oaf-project/oaf-routing/)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-routing/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-routing?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/oaf-project/oaf-routing.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/oaf-routing.svg)](https://www.npmjs.com/package/oaf-routing)

[![dependencies Status](https://david-dm.org/oaf-project/oaf-routing/status.svg)](https://david-dm.org/oaf-project/oaf-routing)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-routing/dev-status.svg)](https://david-dm.org/oaf-project/oaf-routing?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-routing/peer-status.svg)](https://david-dm.org/oaf-project/oaf-routing?type=peer)

# Oaf Routing

Common code for building accessible SPA router wrappers.

Documentation at https://oaf-project.github.io/oaf-routing/

## Compatibility

For IE support you will need to polyfill [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Browser_compatibility). Using [core-js](https://github.com/zloirock/core-js):

```javascript
import "core-js/es6/map";
```

If you use the `smoothScroll` option of `RouterSettings`, you may want to use iamdunstan's [smoothscroll polyfill](https://github.com/iamdustan/smoothscroll). See [MDN's `scrollIntoView` browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Browser_compatibility).

## Libraries that use Oaf Routing
* [Oaf React Router](https://github.com/oaf-project/oaf-react-router) for [React Router](https://github.com/ReactTraining/react-router).
* [Oaf Next.js Router](https://github.com/oaf-project/oaf-next.js-router) for [Next.js](https://github.com/zeit/next.js/).
* [Oaf Navi](https://github.com/oaf-project/oaf-navi) for [Navi](https://github.com/frontarm/navi).
* [Oaf Vue Router](https://github.com/oaf-project/oaf-vue-router) for [Vue Router](https://router.vuejs.org/).
* [Oaf Angular Router](https://github.com/oaf-project/oaf-angular-router) for [Angular's Router](https://angular.io/guide/router).
* [Oaf Svelte Routing](https://github.com/oaf-project/oaf-svelte-routing) for [Svelte Routing](https://github.com/EmilTholin/svelte-routing).
* [Oaf Ember Routing](https://github.com/oaf-project/oaf-ember-routing) for [Ember](https://guides.emberjs.com/release/routing/).
* [Your accessible SPA router wrapper here?](https://github.com/oaf-project/oaf-routing/labels/new-impl)

## See also
* [Single Page Apps routers are broken](https://medium.com/@robdel12/single-page-apps-routers-are-broken-255daa310cf)
* [Accessible page titles in a Single Page App](https://hiddedevries.nl/en/blog/2018-07-19-accessible-page-titles-in-a-single-page-app)
* [Single page applications, Angular.js and accessibility](http://simplyaccessible.com/article/spangular-accessibility)
* [Creating accessible React apps](https://simplyaccessible.com/article/react-a11y/)
* [Accessible React Router navigation with ARIA Live Regions and Redux](https://almerosteyn.com/2017/03/accessible-react-navigation)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
