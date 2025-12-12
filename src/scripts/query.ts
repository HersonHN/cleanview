import { isNode } from "./helpers";

import type { CustomNodeElement } from "../types/cleanview";
import type { HimalayaElement } from "../types/himalaya";

function query(tag: string, element: HimalayaElement | HimalayaElement[]) {
  const founds: CustomNodeElement[] = [];
  search(tag, element, founds);

  return founds;
}

function search(
  tag: string,
  element: HimalayaElement | HimalayaElement[],
  founds: CustomNodeElement[]
): void {
  if (Array.isArray(element)) {
    element.forEach(function (el) {
      search(tag, el, founds);
    });
    return;
  }

  if (!isNode(element)) return;

  // If the tagname match, add the element and return
  if (element.tagName === tag) {
    founds.push(element);
    return;
  }

  // If the element doesn't have children there's no need to continue
  if (!element.children) return;

  // If the element has children search recursively
  element.children.forEach(function (el) {
    if (isNode(el)) search(tag, el, founds);
  });
}

export default query;
