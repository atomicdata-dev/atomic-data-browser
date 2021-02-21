/**
 * A class representing a half-open interval of characters.  A range's `location`
 * property and `max()` value can be used as arguments for the `substring()`
 * method to extract a range of characters.
 */
class Range {
	/**
	 * @param {number} [location=-1] - Starting index of the range.
	 * @param {number} [length=0] - Number of characters in the range.
	 */
	constructor(
		location,
		length)
	{
		if (typeof location == "number") {
			this.location = location;
			this.length = length;
		} else {
			this.location = -1;
			this.length = 0;
		}
	}


	/* eslint no-inline-comments: 0 */
	/**
	 * Gets the end index of the range, which indicates the character
	 * immediately after the last one in the range.
	 *
	 * @returns {number}
	 *//**
	 * Sets the end index of the range, which indicates the character
	 * immediately after the last one in the range.
	 *
	 * @param {number} [value] - End of the range.
	 *
	 * @returns {number}
	 */
	max(
		value)
	{
		if (typeof value == "number") {
			this.length = value - this.location;
		}

			// the NSMaxRange() function in Objective-C returns this value
		return this.location + this.length;
	}


	/**
	 * Returns whether the range contains a location >= 0.
	 *
	 * @returns {boolean}
	 */
	isValid()
	{
		return (this.location > -1);
	}


	/**
	 * Returns an array of the range's start and end indexes.
	 *
	 * @returns {Array<number>}
	 */
	toArray()
	{
		return [this.location, this.max()];
	}


	/**
	 * Returns a string representation of the range's open interval.
	 *
	 * @returns {string}
	 */
	toString()
	{
		if (this.location == -1) {
			return "invalid range";
		} else {
			return "[" + this.location + "," + this.max() + ")";
		}
	}
}

const BaseConfigDefaults = {
	wordSeparators: "-/\\:()<>%._=&[]+ \t\n\r",
	uppercaseLetters: (() => {
		const charCodeA = "A".charCodeAt(0);
		const uppercase = [];

		for (let i = 0; i < 26; i++) {
			uppercase.push(String.fromCharCode(charCodeA + i));
		}

		return uppercase.join("");
	})(),
	ignoredScore: 0.9,
	skippedScore: 0.15,
	emptyQueryScore: 0
};
const QSConfigDefaults = {
	longStringLength: 150,
	maxMatchStartPct: 0.15,
	minMatchDensityPct: 0.75,
	maxMatchDensityPct: 0.95,
	beginningOfStringPct: 0.1
};


class Config {
	constructor(
		options)
	{
		Object.assign(this, BaseConfigDefaults, options);
	}


	useSkipReduction()
	{
		return true;
	}


	adjustRemainingScore(
		string,
		query,
		remainingScore,
		skippedSpecialChar,
		searchRange,
		remainingSearchRange,
		matchedRange,
		fullMatchedRange)
	{
			// use the original Quicksilver expression for the remainingScore
		return remainingScore * remainingSearchRange.length;
	}
}


class QuickScoreConfig extends Config {
	constructor(
		options)
	{
		super(Object.assign({}, QSConfigDefaults, options));
	}


	useSkipReduction(
		string,
		query,
		remainingScore,
		searchRange,
		remainingSearchRange,
		matchedRange,
		fullMatchedRange)
	{
		const len = string.length;
		const isShortString = len <= this.longStringLength;
		const matchStartPercentage = fullMatchedRange.location / len;

		return isShortString || matchStartPercentage < this.maxMatchStartPct;
	}


	adjustRemainingScore(
		string,
		query,
		remainingScore,
		skippedSpecialChar,
		searchRange,
		remainingSearchRange,
		matchedRange,
		fullMatchedRange)
	{
		const isShortString = string.length <= this.longStringLength;
		const matchStartPercentage = fullMatchedRange.location / string.length;
		let matchRangeDiscount = 1;
		let matchStartDiscount = (1 - matchStartPercentage);

			// discount the remainingScore based on how much larger the match is
			// than the query, unless the match is in the first 10% of the
			// string, the match range isn't too sparse and the whole string is
			// not too long.  also only discount if we didn't skip any whitespace
			// or capitals.
		if (!skippedSpecialChar) {
			matchRangeDiscount = query.length / fullMatchedRange.length;
			matchRangeDiscount = (isShortString &&
				matchStartPercentage <= this.beginningOfStringPct &&
				matchRangeDiscount >= this.minMatchDensityPct) ?
				1 : matchRangeDiscount;
			matchStartDiscount = matchRangeDiscount >= this.maxMatchDensityPct ?
				1 : matchStartDiscount;
		}

			// discount the scores of very long strings
		return remainingScore *
			Math.min(remainingSearchRange.length, this.longStringLength) *
			matchRangeDiscount * matchStartDiscount;
	}
}


function createConfig(
	options)
{
	if (options instanceof Config) {
			// this is a full-fledged Config instance, so we don't need to do
			// anything to it
		return options;
	} else {
			// create a complete config from this
		return new QuickScoreConfig(options);
	}
}


const DefaultConfig = createConfig();
new Config();
new Config({
		// the Quicksilver algorithm returns .9 for empty queries
	emptyQueryScore: 0.9,
	adjustRemainingScore: function(
		string,
		query,
		remainingScore,
		skippedSpecialChar,
		searchRange,
		remainingSearchRange,
		matchedRange,
		fullMatchedRange)
	{
		let score = remainingScore * remainingSearchRange.length;

		if (!skippedSpecialChar) {
				// the current QuickSilver algorithm reduces the score by half
				// this value when no special chars are skipped, so add the half
				// back in to match it
			score += ((matchedRange.location - searchRange.location) / 2.0);
		}

		return score;
	}
});

/**
 * Scores a string against a query.
 *
 * @param {string} string - The string to score.
 *
 * @param {string} query - The query string to score the `string` parameter against.
 *
 * @param {Array} [matches] - If supplied, the `quickScore()` will push
 * onto `matches` an array with start and end indexes for each substring range
 * of `string` that matches `query`.  These indexes can be used to highlight the
 * matching characters in an auto-complete UI.
 *
 * @param {string} [transformedString] - A transformed version of the string that
 * will be used for matching.  This defaults to a lowercase version of `string`,
 * but it could also be used to match against a string with all the diacritics
 * removed, so an unaccented character in the query would match an accented one
 * in the string.
 *
 * @param {string} [transformedQuery] - A transformed version of `query`.  The
 * same transformation applied to `transformedString` should be applied to this
 * parameter, or both can be left as `undefined` for the default lowercase
 * transformation.
 *
 * @param {object} [config] - A configuration object that can modify how the
 * `quickScore` algorithm behaves.
 *
 * @param {Range} [stringRange] - The range of characters in `string` that should
 * be checked for matches against `query`.  Defaults to all of the `string`
 * parameter.
 *
 * @returns {number}
 */
function quickScore(
	string = "",
	query = "",
	matches,
	transformedString = string.toLocaleLowerCase(),
	transformedQuery = query.toLocaleLowerCase(),
	config = DefaultConfig,
	stringRange = new Range(0, string.length))
{
	if (!query) {
		return config.emptyQueryScore;
	}

	return calcScore(stringRange, new Range(0, query.length), new Range());


	function calcScore(
		searchRange,
		queryRange,
		fullMatchedRange)
	{
		if (!queryRange.length) {
				// deduct some points for all remaining characters
			return config.ignoredScore;
		}

		if (queryRange.length > searchRange.length) {
			return 0;
		}

		const initialMatchesLength = matches && matches.length;

		for (let i = queryRange.length; i > 0; i--) {
			const querySubstring = transformedQuery.substring(queryRange.location, queryRange.location + i);
				// reduce the length of the search range by the number of chars
				// we're skipping in the query, to make sure there's enough string
				// left to possibly contain the skipped chars
			const matchedRange = getRangeOfSubstring(transformedString, querySubstring,
				new Range(searchRange.location, searchRange.length - queryRange.length + i));

			if (!matchedRange.isValid()) {
					// we didn't find the query substring, so try again with a
					// shorter substring
				continue;
			}

			if (!fullMatchedRange.isValid()) {
				fullMatchedRange.location = matchedRange.location;
			} else {
				fullMatchedRange.location = Math.min(fullMatchedRange.location, matchedRange.location);
			}

			fullMatchedRange.max(matchedRange.max());

			if (matches) {
				matches.push([matchedRange.location, matchedRange.max()]);
			}

			const remainingSearchRange = new Range(matchedRange.max(), searchRange.max() - matchedRange.max());
			const remainingQueryRange = new Range(queryRange.location + i, queryRange.length - i);
			const remainingScore = calcScore(remainingSearchRange, remainingQueryRange, fullMatchedRange);

			if (remainingScore) {
				let score = remainingSearchRange.location - searchRange.location;
					// default to true since we only want to apply a discount if
					// we hit the final else clause below, and we won't get to
					// any of them if the match is right at the start of the
					// searchRange
				let skippedSpecialChar = true;
				const useSkipReduction = config.useSkipReduction(string, query,
					remainingScore, remainingSearchRange, searchRange,
					remainingSearchRange, matchedRange, fullMatchedRange);

				if (matchedRange.location > searchRange.location) {
						// some letters were skipped when finding this match, so
						// adjust the score based on whether spaces or capital
						// letters were skipped
					if (useSkipReduction &&
							config.wordSeparators.indexOf(string[matchedRange.location - 1]) > -1) {
						for (let j = matchedRange.location - 2; j >= searchRange.location; j--) {
							if (config.wordSeparators.indexOf(string[j]) > -1) {
								score--;
							} else {
								score -= config.skippedScore;
							}
						}
					} else if (useSkipReduction &&
							config.uppercaseLetters.indexOf(string[matchedRange.location]) > -1) {
						for (let j = matchedRange.location - 1; j >= searchRange.location; j--) {
							if (config.uppercaseLetters.indexOf(string[j]) > -1) {
								score--;
							} else {
								score -= config.skippedScore;
							}
						}
					} else {
							// reduce the score by the number of chars we've
							// skipped since the beginning of the search range
						score -= matchedRange.location - searchRange.location;
						skippedSpecialChar = false;
					}
				}

				score += config.adjustRemainingScore(string,
					query, remainingScore, skippedSpecialChar, searchRange,
					remainingSearchRange, matchedRange, fullMatchedRange);
				score /= searchRange.length;

				return score;
			} else if (matches) {
					// the remaining query does not appear in the remaining
					// string, so strip off any matches we've added during the
					// current call, as they'll be invalid when we start over
					// with a shorter piece of the query
				matches.length = initialMatchesLength;
			}
		}

		return 0;
	}
}

	// make createConfig() available on quickScore so that the QuickScore
	// constructor has access to it
quickScore.createConfig = createConfig;


function getRangeOfSubstring(
	string,
	substring,
	searchRange)
{
	const stringToSearch = string.substring(searchRange.location, searchRange.max());
	const subStringIndex = stringToSearch.indexOf(substring);
	const result = new Range();

	if (subStringIndex > -1) {
		result.location = subStringIndex + searchRange.location;
		result.length = substring.length;
	}

	return result;
}

/**
 * A class for scoring and sorting a list of items against a query string.  Each
 * item receives a floating point score between `0` and `1`.
 */
class QuickScore {
	/**
	 * @param {Array<string> | Array<object>} [items] - The list of items to
	 * score.  If the list is not a flat array of strings, a `keys` array must
	 * be supplied via the second parameter.  The `items` array is not modified
	 * by QuickScore.
	 *
	 * @param {Array<string> | object} [options] - If the `items` parameter is
	 * an array of flat strings, the `options` parameter can be left out.  If
	 * it is a list of objects containing keys that should be scored, the
	 * `options` parameter must either be an array of key names or an object
	 * containing a `keys` property.
	 *
	 * @param {Array<string> | Array<{name: string, scorer: function}>} [options.keys] -
	 * In the simplest case, an array of key names to score on the objects
	 * in the `items` array.  The first item in this array is considered the
	 * primary key, which is used to sort items when they have the same
	 * score.  The key name strings can point to a nested key by specifying a
	 * dot-delimited path to the value.  So a key `name` of `"foo.bar"` would
	 * evaluate to `"baz"` given an object like `{ foo: { bar: "baz" } }`.
	 *
	 * Each item in `keys` can instead be a `{name, scorer}` object, which
	 * lets you specify a different scoring function for each key.  The
	 * scoring function should behave as described next.
	 *
	 * @param {function(string, string, array?): number} [options.scorer] -
	 * An optional function that takes `string` and `query` parameters and
	 * returns a floating point number between 0 and 1 that represents how
	 * well the `query` matches the `string`.  It defaults to the
	 * [quickScore()]{@link quickScore} function in this library.
	 *
	 * If the function gets a `matches` parameter, it should fill the
	 * passed in array with indexes corresponding to where the query
	 * matches the string, as described in the [search()]{@link QuickScore#search}
	 * method.
	 *
	 * @param {function(string): string} [options.transformString] -
	 * An optional function that takes a `string` parameter and returns a
	 * transformed version of that string.  This function will be called on each
	 * of the searchable keys in the `items` array as well as on the `query`
	 * parameter to the `search()` method.  The default function calls
	 * `toLocaleLowerCase()` on each string, for a case-insensitive search.
	 *
	 * You can pass a function here to do other kinds of preprocessing, such as
	 * removing diacritics from all the strings or converting Chinese characters
	 * to pinyin.  For example, you could use the
	 * [`latinize`](https://www.npmjs.com/package/latinize) npm package to
	 * convert characters with diacritics to the base character so that your
	 * users can type an unaccented character in the query while still matching
	 * items that have accents or diacritics.  Pass in an `options` object like
	 * this to use a custom `transformString()` function:
	 * `{ transformString: s => latinize(s.toLocaleLowerCase()) }`
	 *
	 * @param {object} [options.config] - An optional object that can be passed
	 * to the scorer function to further customize it's behavior.  If the
	 * `scorer` function has a `createConfig()` method on it, the `QuickScore`
	 * instance will call that with the `config` value and store the result.
	 * This can be used to extend the `config` parameter with default values.
	 *
	 * @param {number} [options.minimumScore=0] - An optional value that
	 * specifies the minimum score an item must have to appear in the results
	 * array returned from [search()]{@link QuickScore#search}.  Defaults to `0`,
	 * so items that don't match the full `query` will not be returned.  This
	 * value is ignored if the `query` is empty or undefined, in which case all
	 * items are returned, sorted alphabetically and case-insensitively.
	 */
	constructor(
		items = [],
		options = {})
	{
		let optionsValue = options;

		if (options instanceof Array) {
			optionsValue = { keys: options };
		}

		const {
			scorer = quickScore,
			transformString = this.transformString,
			keys = [],
			minimumScore = 0,
			config
		} = optionsValue;

		this.scorer = scorer;
		this.minimumScore = minimumScore;
		this.config = config;
		this.transformString = transformString;

		if (typeof scorer.createConfig == "function") {
				// let the scorer fill out the config with default values
			this.config = scorer.createConfig(config);
		}

		this.setKeys(keys);
		this.setItems(items);

			// the scoring function needs access to this.defaultKeyName
		this.compareScoredStrings = this.compareScoredStrings.bind(this);
	}


	/**
	 * Scores the instance's items against the `query` and sorts them from
	 * highest to lowest.
	 *
	 * @param {string} query - The string to score each item against.
	 *
	 * @returns {Array<object>} When the instance's `items` are flat strings,
	 * the result objects contain the following properties:
	 *
	 * - `item`: the string that was scored
	 * - `score`: the floating point score of the string for the current query
	 * - `matches`: an array of arrays that specifies the character ranges
	 *   where the query matched the string
	 *
	 * When the `items` are objects, the result objects contain:
	 *
	 * - `item`: the object that was scored
	 * - `score`: the highest score from among the individual key scores
	 * - `scoreKey`: the name of the key with the highest score, which will be
	 *   an empty string if they're all zero
	 * - `scores`: a hash of the individual scores for each key
	 * - `matches`: a hash of arrays that specify the character ranges of the
	 *   query match for each key
	 *
	 * The results array is sorted high to low on each item's score.  Items with
	 * identical scores are sorted alphabetically and case-insensitively on the
	 * primary key.  Items with scores that are <= the `minimumScore` option
	 * (defaults to `0`) are not returned, unless the `query` is falsy, in which
	 * case all of the items are returned, sorted alphabetically.
	 *
	 * The arrays of start and end indices in the `matches` array can be used as
	 * parameters to the `substring()` method to extract the characters from
	 * each string that match the query.  This can then be used to format the
	 * matching characters with a different color or style.
	 *
	 * Each result item also has a `_` property, which caches transformed
	 * versions of the item's strings, and might contain additional internal
	 * metadata in the future.  It can be ignored.
	 */
	search(
		query)
	{
		const results = [];
		const {items, transformedItems, keys, config} = this;
			// if the query is empty, we want to return all items, so make the
			// minimum score less than 0
		const minScore = query ? this.minimumScore : -1;
		const transformedQuery = this.transformString(query);

		if (keys.length) {
			for (let i = 0, len = items.length; i < len; i++) {
				const item = items[i];
				const transformedItem = transformedItems[i];
				const result = {
					item,
					score: 0,
					scoreKey: "",
					scores: {},
					matches: {},
					_: transformedItem
				};
				let highScore = 0;
				let scoreKey = "";

					// find the highest score for each keyed string on this item
				for (let j = 0, jlen = keys.length; j < jlen; j++) {
					const key = keys[j];
					const {name} = key;
					const transformedString = transformedItem[name];

						// setItems() checks for non-strings and empty strings
						// when creating the transformed objects, so if the key
						// doesn't exist there, we can ignore it for this item
					if (transformedString) {
						const string = this.getItemString(item, key);
						const matches = [];
						const newScore = key.scorer(string, query, matches,
							transformedString, transformedQuery, config);

						result.scores[name] = newScore;
						result.matches[name] = matches;

						if (newScore > highScore) {
							highScore = newScore;
							scoreKey = name;
						}
					}
				}

				if (highScore > minScore) {
					result.score = highScore;
					result.scoreKey = scoreKey;
					results.push(result);
				}
			}
		} else {
				// items is a flat array of strings
			for (let i = 0, len = items.length; i < len; i++) {
				const item = items[i];
				const transformedItem = transformedItems[i];
				const matches = [];
				const score = this.scorer(item, query, matches, transformedItem,
					transformedQuery, config);

				if (score > minScore) {
					results.push({
						item,
						score,
						matches,
						_: transformedItem
					});
				}
			}
		}

		results.sort(this.compareScoredStrings);

		return results;
	}


	/**
	 * Sets the `keys` configuration.
	 *
	 * @param {Array<string> | Array<object>} keys - List of keys to score, as
	 * either flat strings or `{key, scorer}` objects.
	 */
	setKeys(
		keys)
	{
		this.keys = [].concat(keys);

		if (this.keys.length) {
			const {scorer} = this;

				// associate each key with the scorer function, if it isn't already
				/* eslint object-curly-spacing: 0, object-property-newline: 0 */
			this.keys = this.keys.map(keyItem => {
				const key = (typeof keyItem == "string") ?
					{ name: keyItem, scorer } : keyItem;

				if (key.name.indexOf(".") > -1) {
					key.path = key.name.split(".");
				}

				return key;
			});
			this.defaultKeyName = this.keys[0].name;
		} else {
				// defaultKeyName will be null if items is a flat array of
				// strings, which is handled in compareScoredStrings()
			this.defaultKeyName = null;
		}
	}


	/**
	 * Sets the `items` array and caches a transformed copy of all the item
	 * strings specified by the `keys` parameter to the constructor, using the
	 * `transformString` option (which defaults to `toLocaleLowerCase()`).
	 *
	 * @param {Array<string> | Array<object>} items - List of items to score.
	 */
	setItems(
		items)
	{
		const {keys} = this;
		const transformedItems = [];

		this.items = [].concat(items);
		this.transformedItems = transformedItems;

		if (keys.length) {
			for (let i = 0, len = items.length; i < len; i++) {
				const item = items[i];
				const transformedItem = {};

				for (let j = 0, jlen = keys.length; j < jlen; j++) {
					const key = keys[j];
					const string = this.getItemString(item, key);

					if (string && typeof string === "string") {
						transformedItem[key.name] = this.transformString(string);
					}
				}

				transformedItems.push(transformedItem);
			}
		} else {
			for (let i = 0, len = items.length; i < len; i++) {
				transformedItems.push(this.transformString(items[i]));
			}
		}
	}


	getItemString(
		item,
		key)
	{
		const {name, path} = key;

		if (path) {
			return path.reduce((value, prop) => value && value[prop], item);
		} else {
			return item[name];
		}
	}


	transformString(
		string)
	{
		return string.toLocaleLowerCase();
	}


	compareScoredStrings(
		a,
		b)
	{
			// use the lowercase versions of the strings for sorting
		const itemA = a._;
		const itemB = b._;
		const itemAString = typeof itemA === "string" ? itemA :
			itemA[this.defaultKeyName];
		const itemBString = typeof itemB === "string" ? itemB :
			itemB[this.defaultKeyName];

		if (a.score === b.score) {
				// sort undefineds to the end of the array, as per the ES spec
			if (itemAString === undefined || itemBString === undefined) {
				if (itemAString === undefined && itemBString === undefined) {
					return 0;
				} else if (itemAString === undefined) {
					return 1;
				} else {
					return -1;
				}
			} else if (itemAString === itemBString) {
				return 0;
			} else if (itemAString < itemBString) {
				return -1;
			} else {
				return 1;
			}
		} else {
			return b.score - a.score;
		}
	}
}

export { QuickScore };
