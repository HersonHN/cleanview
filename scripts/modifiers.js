'use strict';

/***
  This needs to be a function within a function because the count
  needs to reset to 1 each time `addIds` is called
***/
function addIds(element) {
  var count = 1;

  function newId() {
    return count++;
  }

  function addId(element) {
    if (!element) return;

    element.id = newId();
    if (!element.children) return;

    element.children.forEach(addId);
  }

  addId(element);
}


function addParents(element, parentId) {
  element.parentId = parentId;

  if (!element.children) return;

  element.children.forEach(child => addParents(child, element.id));
}


function addModifiers(element) {
  addIds(element);
  addParents(element);
}

module.exports = { addIds, addParents, addModifiers };
