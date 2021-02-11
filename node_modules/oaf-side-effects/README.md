[![Build Status](https://travis-ci.org/oaf-project/oaf-side-effects.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-side-effects)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Foaf-project%2Foaf-side-effects%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![Codecov](https://img.shields.io/codecov/c/github/oaf-project/oaf-side-effects.svg)](https://codecov.io/gh/oaf-project/oaf-side-effects)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/oaf-project/oaf-side-effects.svg)](https://lgtm.com/projects/g/oaf-project/oaf-side-effects/)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-side-effects/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-side-effects?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/oaf-project/oaf-side-effects.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/oaf-side-effects.svg)](https://www.npmjs.com/package/oaf-side-effects)
[![npm](https://img.shields.io/npm/dw/oaf-side-effects.svg)](https://www.npmjs.com/package/oaf-side-effects)
[![dependencies Status](https://david-dm.org/oaf-project/oaf-side-effects/status.svg)](https://david-dm.org/oaf-project/oaf-side-effects)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-side-effects/dev-status.svg)](https://david-dm.org/oaf-project/oaf-side-effects?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-side-effects/peer-status.svg)](https://david-dm.org/oaf-project/oaf-side-effects?type=peer)

# Oaf Side Effects

A collection of DOM side-effecting functions to improve the accessibility and usability of single page apps.

Documentation at https://oaf-project.github.io/oaf-side-effects/

## Installation

```sh
# yarn
yarn add oaf-side-effects
# npm
npm install oaf-side-effects
```

## Browser support

* `focusInvalidForm()` uses [closest()](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest), so for IE support you probably want to use the [closest() polyfill described at MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill) or [jonathantneal/closest](https://github.com/jonathantneal/closest).
* Oaf Side Effects supports the smooth scrolling option of [scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), so you might want to use the [smoothscroll polyfill](http://iamdustan.com/smoothscroll/).

## See also

* [Oaf Routing](https://github.com/oaf-project/oaf-routing)
