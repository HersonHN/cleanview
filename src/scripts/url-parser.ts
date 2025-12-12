import parse from "url-parse";
import type { NodeElement } from "../types/himalaya";
import type { CustomNodeElement } from "../types/cleanview";

export function addBaseUrl(
  elements: Record<number, CustomNodeElement>,
  baseURL: string
) {
  for (const id in elements) {
    const el = elements[id];
    if (el.tagName === "a") fixUrl(el, "href", baseURL);
    if (el.tagName === "img") fixUrl(el, "src", baseURL);
  }
}

function fixUrl(element: NodeElement, prop: string, base: string) {
  element.attributes = element.attributes.map(function (attr) {
    if (attr.key !== prop) return attr;
    const url = merge(base, String(attr.value));
    attr.value = url;

    return attr;
  });
}

export function merge(textBase: string, textURL: string): string {
  textURL = (textURL || "").trim();

  if (textURL.indexOf("//") > -1) return textURL;
  if (textURL.indexOf("base64") > -1) return textURL;

  const url = parse(textURL, textBase);

  return url.href;
}
