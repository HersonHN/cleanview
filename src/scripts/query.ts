'use strict';

function $(tag, element) {
  let founds = [];
  search(tag, element, founds);

  return founds;
}


function search(tag, element, founds) {

  if (Array.isArray(element)) {
    element.forEach(function (el) {
      search(tag, el, founds);
    })
    return;
  }

  // If the tagname match, add the element and return
  if (element.tagName === tag) {
    founds.push(element);
    return;
  }

  // If the element doesn't have children there's no need to continue
  if (!element.children) return;

  // If the element has children search recursively
  element.children.forEach(function (el) {
    search(tag, el, founds);
  });

}


module.exports = $;
