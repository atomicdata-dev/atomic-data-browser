'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isElement = isElement;
/**
 * Determines if the passed el is a DOM element
 */
function isElement(el) {
  var isElem = void 0;

  if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object') {
    isElem = el instanceof HTMLElement;
  } else {
    isElem = !!el && (typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string';
  }
  return isElem;
}