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

  function addId(element) {
    if (!element) return;

    let id = newId();
    element.id = id;
    allElements[id] = element;

    if (!element.children) return;

    element.children.forEach(addId);
  }

  addId(element);

  return allElements;
}


function addParents(element, parentId) {
  element.parentId = parentId;

  if (!element.children) return;

  element.children.forEach(child => addParents(child, element.id));
}


function addModifiers(element) {
  let elements = addIds(element);
  addParents(element);

  return elements;
}

module.exports = { addIds, addParents, addModifiers };
