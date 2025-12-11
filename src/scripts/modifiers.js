'use strict';

/***
  This needs to be a function within a function because the count
  needs to reset to 1 each time `addIds` is called
***/
function addIds(element) {
  let allElements = {};
  var count = 1;

  function newId() {
    return count++;
  }

  navigate(element, function (el, parent) {
    if (!el) return;

    let id = newId();
    el.id = id;
    el.parentId = parent.id;

    allElements[id] = el;

  });

  return allElements;
}


function navigate(element, func, parent) {
  parent = parent || {};

  // if it's an array
  if (Array.isArray(element)) {
    element.forEach(function (el) {
      navigate(el, func, parent);
    });

    return;
  }

  // if it's an element
  if (element.type === 'element') {
    func(element, parent);
  }

  if (!element.children) return;

  element.children.forEach(function (el) {
    navigate(el, func, element);
  });

}

module.exports = { addIds };
