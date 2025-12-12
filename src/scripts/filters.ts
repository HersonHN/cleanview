import VALID_TAGS from "../defaults/valid-tags";
import FORBIDDEN_CLASSES from "../defaults/forbidden-classes";
import type {
  CustomNodeElement,
  IterateFunction,
  ParserOptions,
  RecursiveFunc,
} from "../types/cleanview";
import type { HimalayaElement, NodeElement } from "../types/himalaya";
import { isComment, isNode, isNodeWithChildren, isText } from "./helpers";

type AttributeType =
  | "IMAGE"
  | "LINK"
  | "SOURCE"
  | "YOUTUBE"
  | "OTHER"
  | "INVALID";

const VALID_TAGS_SECOND_TRY = [...VALID_TAGS, "header"];

const ATTRIBUTES_TO_KEEP: Record<AttributeType, string[]> = {
  IMAGE: ["src", "title", "alt", "data-src", "srcset", "data-srcset"],
  LINK: ["href", "title"],
  SOURCE: ["srcset"],
  YOUTUBE: ["src", "width", "height", "allowfullscreen", "frameborder"],
  OTHER: [],
  INVALID: [],
};

export function clean(json: HimalayaElement[], options: ParserOptions) {
  options = options || {};

  json = addFlags(json, options);
  json = cleanOuterToInner(json, options);
  json = cleanInnerToOuter(json, options);

  return json;
}

function addFlags(json: HimalayaElement[], options: ParserOptions) {
  json = addFlagForPre(json, options);

  return json;
}

function addFlagForPre(json: HimalayaElement[], options: ParserOptions) {
  return json.map((e) =>
    iterateChildren(e, options, (child, _, parent) => {
      if (parent.tagName === "pre" || parent.insidePre) {
        child.insidePre = true;
      }
      return child;
    })
  );
}

function iterateChildren(
  element: HimalayaElement,
  options: ParserOptions,
  func: IterateFunction
): HimalayaElement {
  if (!element) return element;

  if (!isNode(element)) return element;

  if (!element.children) return element;
  if (!element.children.length) return element;

  element.children = element.children.map((child) => {
    const modified = func(child as CustomNodeElement, options, element);
    iterateChildren(child, options, func);
    return modified;
  });

  return element;
}

function cleanOuterToInner(json: HimalayaElement[], options: ParserOptions) {
  json = json
    .filter((e) => filterComments(e, options))
    .filter((e) => filterSpaces(e, options))
    .filter((e) => filterTags(e, options))
    .filter((e) => filterClasses(e, options))
    .map((e) => cleanAttributes(e, options))
    .map((e) => passToChildren(e, options, cleanOuterToInner));

  return json;
}

function cleanInnerToOuter(json: HimalayaElement[], options: ParserOptions) {
  json = json
    .map((e) => passToChildren(e, options, cleanInnerToOuter))
    .filter((e) => filterEmptyNodes(e, options));

  return json;
}

function filterEmptyNodes(e: HimalayaElement, _options: ParserOptions) {
  if (isComment(e)) return false;
  if (isText(e)) return true;
  if (e.tagName == "img") return true;
  if (e.tagName == "iframe") return true;
  if (e.tagName == "br") return true;
  if (e.tagName == "hr") return true;

  if (!e.children) return true;

  return e.children.length > 0;
}

function filterComments(e: HimalayaElement, _options: ParserOptions): boolean {
  return !isComment(e);
}

function filterSpaces(e: HimalayaElement, _options: ParserOptions) {
  // do not remove spaces when inside a <pre> tag
  if ((e as CustomNodeElement).insidePre) return true;
  const blankSpace = isText(e) && e.content.trim() == "";
  return !blankSpace;
}

function filterTags(e: HimalayaElement, options: ParserOptions) {
  if (isText(e)) return true;
  if (isComment(e)) return false;

  const TAGS = options.secondTry ? VALID_TAGS_SECOND_TRY : VALID_TAGS;

  const aditionalTags = options.includeTags || [];
  const tags = [...TAGS, ...aditionalTags];

  const tag = (e.tagName || "").toLowerCase();
  const isValidTag = tags.indexOf(tag) > -1;

  return isValidTag;
}

function filterClasses(e: HimalayaElement, options: ParserOptions) {
  if (options.includeClasses) return true;
  const forbiddenClasses = options.forbiddenClasses || [];
  const FORBIDDEN = [...FORBIDDEN_CLASSES, ...forbiddenClasses];

  const className = getClass(e);
  let found = false;

  FORBIDDEN.forEach(function (forbidden) {
    if (className.indexOf(forbidden) > -1) {
      found = true;
    }
  });

  return !found;
}

function getClass(e: HimalayaElement) {
  return getProp(e, "class").toLowerCase();
}

function getProp(e: HimalayaElement, prop: string) {
  if (!isNode(e)) return "";
  if (!e.attributes) return "";

  const pair = e.attributes.find((a) => a.key === prop);
  if (pair) return String(pair.value);

  return "";
}

function passToChildren(
  e: HimalayaElement,
  options: ParserOptions,
  func: RecursiveFunc
) {
  if (!isNode(e)) return e;

  if (isNodeWithChildren(e)) {
    e.children = func(e.children, options, func);
  }

  return e;
}

function cleanAttributes(e: HimalayaElement, _options: ParserOptions) {
  if (!isNode(e)) return e;

  const type = getElementType(e);
  const attributeList = ATTRIBUTES_TO_KEEP[type];

  keepAttributes(e, attributeList);

  // make sure invalid elements don't get rendered to html
  if (type === "INVALID") {
    e.tagName = "div";
    e.children = [];
  }

  if (type === "LINK") {
    e.attributes.push({ key: "target", value: "_blank" });
  }

  if (type === "IMAGE") {
    mirrorAttribute(e, "data-src", "src");
    mirrorAttribute(e, "data-srcset", "srcset");
  }

  return e;
}

function mirrorAttribute(e: NodeElement, source: string, target: string) {
  const sourceValue = getProp(e, source);
  const targetValue = getProp(e, target);
  if (sourceValue && !targetValue) {
    e.attributes.push({ key: target, value: sourceValue });
  }
}

function getElementType(e: NodeElement): AttributeType {
  if (e.tagName === "img") return "IMAGE";
  if (e.tagName === "a") return "LINK";
  if (e.tagName === "source") return "SOURCE";

  const isIFrame = e.tagName === "iframe";

  if (isIFrame) {
    const src = getProp(e, "src");

    // TODO: add support to other platforms
    const isYoutube =
      src.indexOf("youtube.com") > 0 || src.indexOf("youtu.be") > 0;
    if (isYoutube) return "YOUTUBE";
  }

  // if is not a youtube video, but is still an iframe, return invalid
  if (isIFrame) return "INVALID";

  return "OTHER";
}

function keepAttributes(e: NodeElement, list: string[]) {
  e.attributes = e.attributes
    .map((a) => ({ key: a.key.toLowerCase(), value: a.value }))
    .filter((attr) => attr.value && list.includes(attr.key));
  return e;
}
