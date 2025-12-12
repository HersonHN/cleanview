import { HimalayaElement } from "../types/himalaya";

export function isComment(e: HimalayaElement) {
  return e.type === "comment";
}

export function isText(e: HimalayaElement) {
  return e.type === "text";
}

export function isNode(e: HimalayaElement) {
  return e.type === "element";
}

export function isNodeWithChildren(e: HimalayaElement) {
  return isNode(e) && e.children && e.children.length > 0;
}
