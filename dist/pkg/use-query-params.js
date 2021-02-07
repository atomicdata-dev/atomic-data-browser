import { c as createCommonjsModule } from './common/_commonjsHelpers-913f9c4a.js';
import { r as react } from './common/index-63a1b8e9.js';

var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

(undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * Interprets an encoded string and returns either the string or null/undefined if not available.
 * Ignores array inputs (takes just first element in array)
 * @param input encoded string
 */
function getEncodedValue(input, allowEmptyString) {
    if (input == null) {
        return input;
    }
    // '' or []
    if (input.length === 0 &&
        (!allowEmptyString || (allowEmptyString && input !== ''))) {
        return null;
    }
    var str = input instanceof Array ? input[0] : input;
    if (str == null) {
        return str;
    }
    if (!allowEmptyString && str === '') {
        return null;
    }
    return str;
}
/**
 * Encodes a string while safely handling null and undefined values.
 *
 * @param {String} str a string to encode
 * @return {String} the encoded string
 */
function encodeString(str) {
    if (str == null) {
        return str;
    }
    return String(str);
}
/**
 * Decodes a string while safely handling null and undefined values.
 *
 * If an array is provided, only the first entry is used.
 *
 * @param {String} input the encoded string
 * @return {String} the string value
 */
function decodeString(input) {
    var str = getEncodedValue(input, true);
    if (str == null)
        return str;
    return String(str);
}

/**
 * String values
 */
var StringParam = {
    encode: encodeString,
    decode: decodeString,
};

var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

var splitOnFirst = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

var queryString = createCommonjsModule(function (module, exports) {




const isNullOrUndefined = value => value === null || value === undefined;

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeUriComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${encode(object.fragmentIdentifier, options)}`;
	}

	return `${url}${queryString}${hash}`;
};
});

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
/**
 * Update a location, wiping out parameters not included in encodedQuery
 * If a param is set to undefined it will be removed from the URL.
 */
function updateLocation(encodedQuery, location, stringifyOptions) {
    var encodedSearchString = queryString.stringify(encodedQuery, stringifyOptions);
    if (stringifyOptions && stringifyOptions.transformSearchString) {
        encodedSearchString = stringifyOptions.transformSearchString(encodedSearchString);
    }
    var search = encodedSearchString.length ? "?" + encodedSearchString : '';
    var href = queryString.parseUrl(location.href || '').url + search;
    var newLocation = __assign$1(__assign$1({}, location), { key: "" + Date.now(), // needed for some routers (e.g. react-router)
        href: href,
        search: search, query: encodedQuery });
    return newLocation;
}
/**
 * Update a location while retaining existing parameters.
 * If a param is set to undefined it will be removed from the URL.
 */
function updateInLocation(encodedQueryReplacements, location, stringifyOptions) {
    // if a query is there, use it, otherwise parse the search string
    var currQuery = location.query || queryString.parse(location.search);
    var newQuery = __assign$1(__assign$1({}, currQuery), encodedQueryReplacements);
    return updateLocation(newQuery, location, stringifyOptions);
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license at
 * https://github.com/facebook/fbjs/blob/master/LICENSE
 */
/*eslint-disable no-self-compare */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
    // SameValue algorithm
    if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
    }
}
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.

 * @pbeshai modification of shallowEqual to take into consideration a map providing
 * equals functions
 */
function shallowEqual(objA, objB, equalMap) {
    var _a, _b;
    if (is(objA, objB)) {
        return true;
    }
    if (typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        var isEqual = (_b = (_a = equalMap === null || equalMap === void 0 ? void 0 : equalMap[keysA[i]]) === null || _a === void 0 ? void 0 : _a.equals) !== null && _b !== void 0 ? _b : is;
        if (!hasOwnProperty.call(objB, keysA[i]) ||
            !isEqual(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}

function useUpdateRefIfShallowNew(ref, newValue, isEqual) {
    if (isEqual === void 0) { isEqual = shallowEqual; }
    var hasNew = ((ref.current == null || newValue == null) && ref.current === newValue) ||
        !isEqual(ref.current, newValue);
    react.useEffect(function () {
        if (hasNew) {
            ref.current = newValue;
        }
    }, [ref, newValue, hasNew]);
}
function getSSRSafeSearchString(location) {
    // handle checking SSR (#13)
    if (typeof location === 'object') {
        // in browser
        if (typeof window !== 'undefined') {
            return location.search;
        }
        else {
            return queryString.extract("" + location.pathname + (location.search ? location.search : ''));
        }
    }
    return '';
}

/**
 * Creates a new location object containing the specified query changes.
 * If replaceIn or pushIn are used as the updateType, then parameters
 * not specified in queryReplacements are retained. If replace or push
 * are used, only the values in queryReplacements will be available.
 * The default is pushIn.
 */
function createLocationWithChanges(queryReplacements, location, updateType, stringifyOptions) {
    if (updateType === void 0) { updateType = 'pushIn'; }
    switch (updateType) {
        case 'replace':
        case 'push':
            return updateLocation(queryReplacements, location, stringifyOptions);
        case 'replaceIn':
        case 'pushIn':
        default:
            return updateInLocation(queryReplacements, location, stringifyOptions);
    }
}
/**
 * Updates the URL to the new location.
 */
function updateUrlQuery(history, location, updateType) {
    if (updateType === void 0) { updateType = 'pushIn'; }
    switch (updateType) {
        case 'pushIn':
        case 'push':
            history.push(location);
            break;
        case 'replaceIn':
        case 'replace':
        default:
            history.replace(location);
            break;
    }
}

var providerlessContextValue = {
    location: {},
    getLocation: function () { return ({}); },
    setLocation: function () { },
};
var LocationContext = react.createContext(providerlessContextValue);
function useLocationContext() {
    var context = react.useContext(LocationContext);
    return context;
}
/**
 * An internal-only context provider which provides down the most
 * recent location object and a callback to update the history.
 */
function LocationProvider(_a) {
    var history = _a.history, location = _a.location, children = _a.children, stringifyOptions = _a.stringifyOptions;
    var locationRef = react.useRef(location);
    react.useEffect(function () {
        locationRef.current = location;
    }, [location]);
    // TODO: we can probably simplify this now that we are reading location from history
    var getLocation = react.useCallback(function () { return locationRef.current; }, [
        locationRef,
    ]);
    var setLocation = react.useCallback(function (queryReplacements, updateType) {
        // A ref is needed here to stop setLocation updating constantly (see #46)
        locationRef.current = createLocationWithChanges(queryReplacements, history == null || history.location == null
            ? locationRef.current
            : history.location, updateType, stringifyOptions);
        if (history) {
            updateUrlQuery(history, locationRef.current, updateType);
        }
    }, [history, stringifyOptions]);
    return (react.createElement(LocationContext.Provider, { value: { location: location, getLocation: getLocation, setLocation: setLocation } }, children));
}

var makeMemoizedQueryParser = function (initialSearchString) {
    var cachedSearchString = initialSearchString;
    var cachedParsedQuery = queryString.parse(cachedSearchString || '');
    return function (newSearchString) {
        if (cachedSearchString !== newSearchString) {
            cachedSearchString = newSearchString;
            cachedParsedQuery = queryString.parse(cachedSearchString);
        }
        return cachedParsedQuery;
    };
};
var sharedMemoizedQueryParser = makeMemoizedQueryParser();

/**
 * Helper to get the latest decoded value with smart caching.
 * Abstracted into its own function to allow re-use in a functional setter (#26)
 */
function getLatestDecodedValue(location, name, paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef) {
    var _a;
    // check if we have a new param config
    var hasNewParamConfig = !shallowEqual(paramConfigRef.current, paramConfig);
    var isValueEqual = (_a = paramConfig.equals) !== null && _a !== void 0 ? _a : shallowEqual;
    // read in the parsed query
    var parsedQuery = sharedMemoizedQueryParser(getSSRSafeSearchString(location) // get the latest location object
    );
    // read in the encoded string value (we have to check cache if available because
    // sometimes the query string changes so we get a new parsedQuery but this value
    // didn't change, so we should avoid generating a new array or whatever value)
    var hasNewEncodedValue = !shallowEqual(encodedValueCacheRef.current, parsedQuery[name]);
    var encodedValue = hasNewEncodedValue
        ? parsedQuery[name]
        : encodedValueCacheRef.current;
    // only decode if we have changes to encoded value or the config.
    // check for undefined to handle initial case
    if (!hasNewEncodedValue &&
        !hasNewParamConfig &&
        decodedValueCacheRef.current !== undefined) {
        return decodedValueCacheRef.current;
    }
    var newDecodedValue = paramConfig.decode(encodedValue);
    var hasNewDecodedValue = ((decodedValueCacheRef.current == null || newDecodedValue == null) &&
        decodedValueCacheRef.current === newDecodedValue) ||
        !isValueEqual(decodedValueCacheRef.current, newDecodedValue);
    // if we have a new decoded value use it, otherwise use cached
    return hasNewDecodedValue
        ? newDecodedValue
        : decodedValueCacheRef.current;
}
/**
 * Given a query param name and query parameter configuration ({ encode, decode })
 * return the decoded value and a setter for updating it.
 *
 * The setter takes two arguments (newValue, updateType) where updateType
 * is one of 'replace' | 'replaceIn' | 'push' | 'pushIn', defaulting to
 * 'pushIn'.
 *
 * You may optionally pass in a rawQuery object, otherwise the query is derived
 * from the location available in the context.
 *
 * D = decoded type
 * D2 = return value from decode (typically same as D)
 */
var useQueryParam = function (name, paramConfig) {
    if (paramConfig === void 0) { paramConfig = StringParam; }
    var _a = useLocationContext(), location = _a.location, getLocation = _a.getLocation, setLocation = _a.setLocation;
    // read in the raw query
    var parsedQuery = sharedMemoizedQueryParser(getSSRSafeSearchString(location));
    // make caches
    var encodedValueCacheRef = react.useRef();
    var paramConfigRef = react.useRef(paramConfig);
    var decodedValueCacheRef = react.useRef();
    var decodedValue = getLatestDecodedValue(location, name, paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef);
    // update cached values in a useEffect
    useUpdateRefIfShallowNew(encodedValueCacheRef, parsedQuery[name]);
    useUpdateRefIfShallowNew(paramConfigRef, paramConfig);
    useUpdateRefIfShallowNew(decodedValueCacheRef, decodedValue, paramConfig.equals);
    // create the setter, memoizing via useCallback
    var setValueDeps = {
        paramConfig: paramConfig,
        name: name,
        setLocation: setLocation,
        getLocation: getLocation,
    };
    var setValueDepsRef = react.useRef(setValueDeps);
    setValueDepsRef.current = setValueDeps;
    var setValue = react.useCallback(function setValueCallback(newValue, updateType) {
        var _a;
        var deps = setValueDepsRef.current;
        var newEncodedValue;
        // allow functional updates #26
        if (typeof newValue === 'function') {
            // get latest decoded value to pass as a fresh arg to the setter fn
            var latestValue = getLatestDecodedValue(deps.getLocation(), deps.name, deps.paramConfig, paramConfigRef, encodedValueCacheRef, decodedValueCacheRef);
            decodedValueCacheRef.current = latestValue; // keep cache in sync
            newEncodedValue = deps.paramConfig.encode(newValue(latestValue));
        }
        else {
            newEncodedValue = deps.paramConfig.encode(newValue);
        }
        // update the URL
        deps.setLocation((_a = {}, _a[deps.name] = newEncodedValue, _a), updateType);
    }, []);
    return [decodedValue, setValue];
};

var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
// we use a lazy caching solution to prevent #46 from happening
var cachedWindowHistory;
var cachedAdaptedWindowHistory;
/**
 * Adapts standard DOM window history to work with our
 * { replace, push } interface.
 *
 * @param history Standard history provided by DOM
 */
function adaptWindowHistory(history) {
    if (history === cachedWindowHistory && cachedAdaptedWindowHistory != null) {
        return cachedAdaptedWindowHistory;
    }
    var adaptedWindowHistory = {
        replace: function (location) {
            history.replaceState(location.state, '', location.protocol + "//" + location.host + location.pathname + location.search);
        },
        push: function (location) {
            history.pushState(location.state, '', location.protocol + "//" + location.host + location.pathname + location.search);
        },
        get location() {
            return window.location;
        },
    };
    cachedWindowHistory = history;
    cachedAdaptedWindowHistory = adaptedWindowHistory;
    return adaptedWindowHistory;
}
// we use a lazy caching solution to prevent #46 from happening
var cachedReachHistory;
var cachedAdaptedReachHistory;
/**
 * Adapts @reach/router history to work with our
 * { replace, push } interface.
 *
 * @param history globalHistory from @reach/router
 */
function adaptReachHistory(history) {
    if (history === cachedReachHistory && cachedAdaptedReachHistory != null) {
        return cachedAdaptedReachHistory;
    }
    var adaptedReachHistory = {
        replace: function (location) {
            history.navigate(location.protocol + "//" + location.host + location.pathname + location.search, { replace: true });
        },
        push: function (location) {
            history.navigate(location.protocol + "//" + location.host + location.pathname + location.search, { replace: false });
        },
        get location() {
            return history.location;
        },
    };
    cachedReachHistory = history;
    cachedAdaptedReachHistory = adaptedReachHistory;
    return adaptedReachHistory;
}
/**
 * Helper to produce the context value falling back to
 * window history and location if not provided.
 */
function getLocationProps(_a) {
    var _b = _a === void 0 ? {} : _a, history = _b.history, location = _b.location;
    var hasWindow = typeof window !== 'undefined';
    if (hasWindow) {
        if (!history) {
            history = adaptWindowHistory(window.history);
        }
        if (!location) {
            location = window.location;
        }
    }
    if (!location) {
        throw new Error("\n        Could not read the location. Is the router wired up correctly?\n      ");
    }
    return { history: history, location: location };
}
/**
 * Context provider for query params to have access to the
 * active routing system, enabling updates to the URL.
 */
function QueryParamProvider(_a) {
    var children = _a.children, ReactRouterRoute = _a.ReactRouterRoute, reachHistory = _a.reachHistory, history = _a.history, location = _a.location, stringifyOptions = _a.stringifyOptions;
    // cache the stringify options object so we users can just do
    // <QueryParamProvider stringifyOptions={{ encode: false }} />
    var stringifyOptionsRef = react.useRef(stringifyOptions);
    var hasNewStringifyOptions = !shallowEqual(stringifyOptionsRef.current, stringifyOptions);
    var stringifyOptionsCached = hasNewStringifyOptions
        ? stringifyOptions
        : stringifyOptionsRef.current;
    react.useEffect(function () {
        stringifyOptionsRef.current = stringifyOptionsCached;
    }, [stringifyOptionsCached]);
    // if we have React Router, use it to get the context value
    if (ReactRouterRoute) {
        return (react.createElement(ReactRouterRoute, null, function (routeProps) {
            return (react.createElement(LocationProvider, __assign$3({ stringifyOptions: stringifyOptionsCached }, getLocationProps(routeProps)), children));
        }));
    }
    // if we are using reach router, use its history
    if (reachHistory) {
        return (react.createElement(LocationProvider, __assign$3({ stringifyOptions: stringifyOptionsCached }, getLocationProps({
            history: adaptReachHistory(reachHistory),
            location: location,
        })), children));
    }
    // neither reach nor react-router, so allow manual overrides
    return (react.createElement(LocationProvider, __assign$3({ stringifyOptions: stringifyOptionsCached }, getLocationProps({ history: history, location: location })), children));
}

export { QueryParamProvider, StringParam, useQueryParam };
