"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_string_1 = require("query-string");
exports.makeMemoizedQueryParser = function (initialSearchString) {
    var cachedSearchString = initialSearchString;
    var cachedParsedQuery = query_string_1.parse(cachedSearchString || '');
    return function (newSearchString) {
        if (cachedSearchString !== newSearchString) {
            cachedSearchString = newSearchString;
            cachedParsedQuery = query_string_1.parse(cachedSearchString);
        }
        return cachedParsedQuery;
    };
};
exports.sharedMemoizedQueryParser = exports.makeMemoizedQueryParser();
