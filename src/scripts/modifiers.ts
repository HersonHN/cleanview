import { CustomNodeElement } from "../types/cleanview";
import { HimalayaElement } from "../types/himalaya";
import { isNode } from "./helpers";

/***
  This needs to be a function within a function because the count
  needs to reset to 1 each time `addIds` is called
***/
export function addIds(elements: HimalayaElement[]) {
  let allElements: Record<number, CustomNodeElement> = {};
  var count = 1;

  function newId() {
    return count++;
  }

  navigate(elements, function (el, parent) {
    if (!el) return;

    let id = newId();
    el.id = id;
    el.parentId = parent.id;

    allElements[id] = el;
  });

  return allElements;
}

type NavigateFunc = (
  el: CustomNodeElement | null,
  parent: CustomNodeElement
) => void;

function navigate(
  element: HimalayaElement | HimalayaElement[],
  func: NavigateFunc,
  parent?: CustomNodeElement
) {
  parent = parent ?? ({} as CustomNodeElement);

  // if it's an array
  if (Array.isArray(element)) {
    element.forEach(function (el) {
      navigate(el, func, parent);
    });

    return;
  }

  if (!isNode(element)) return;

  // if it's an element
  func(element, parent);

  element.children.forEach(function (el) {
    navigate(el, func, element);
  });
}
