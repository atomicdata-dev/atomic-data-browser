'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getID = getID;
/**
 * Returns the Tag of the element
 * @param  { Object } element
 * @return { String }
 */
function getID(el) {
  var id = el.getAttribute('id');

  if (id !== null && id !== '') {
    // if the ID starts with a number selecting with a hash will cause a DOMException
    return id.match(/^\d/) ? '[id="' + id + '"]' : '#' + id;
  }
  return null;
}