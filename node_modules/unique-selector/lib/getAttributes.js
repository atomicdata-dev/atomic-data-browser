'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttributes = getAttributes;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Returns the Attribute selectors of the element
 * @param  { DOM Element } element
 * @param  { Array } array of attributes to ignore
 * @return { Array }
 */
function getAttributes(el) {
  var attributesToIgnore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['id', 'class', 'length'];
  var attributes = el.attributes;

  var attrs = [].concat(_toConsumableArray(attributes));

  return attrs.reduce(function (sum, next) {
    if (!(attributesToIgnore.indexOf(next.nodeName) > -1)) {
      sum.push('[' + next.nodeName + '="' + next.value + '"]');
    }
    return sum;
  }, []);
}