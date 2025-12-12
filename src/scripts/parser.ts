import * as himalaya from "himalaya";

import * as filters from "./filters";
import * as modifiers from "./modifiers";
import * as urlParser from "./url-parser";
import $ from "./query";

import type { CustomNodeElement, ParserOptions } from "../types/cleanview";
import type { HimalayaElement } from "../types/himalaya";

const MIN_DEFAULT_RATIO = 0.75;

function parse(html: string, options: ParserOptions) {
  options = options || {};
  options.url = options.url || "";

  let { allElements, allParagraphs, clearedJSON } = parseJSON(html, options);

  // If there's no paragraphs from the search, try again without filtering classes
  if (!allParagraphs.length) {
    options.secondTry = true;
    options.includeClasses = true;

    const result = parseJSON(html, options);

    allParagraphs = result.allParagraphs;
    allElements = result.allElements;
    clearedJSON = result.clearedJSON;
  }

  // if it's the second time around
  if (!allParagraphs.length) {
    return nothing(options);
  }

  const contentElement = getContentElement(allElements, allParagraphs, options);

  return stringify([contentElement]);
}

function parseJSON(html: string, options: ParserOptions) {
  const url = options.url || "";
  const json = himalaya.parse(html);

  // clean the elements
  const clearedJSON = filters.clean(json, options);

  // add ids to each one
  const allElements = modifiers.addIds(clearedJSON);

  // fix all the relative urls
  urlParser.addBaseUrl(allElements, url);

  const allParagraphs = $("p", clearedJSON);

  return { allParagraphs, clearedJSON, allElements };
}

function getContentElement(
  allElements: Record<number, CustomNodeElement>,
  allParagraphs: CustomNodeElement[],
  options: ParserOptions
) {
  const MIN_RATIO = options.minRatio || MIN_DEFAULT_RATIO;
  const totalParagraphs = allParagraphs.length;

  // the element with more paragraphs will be the the one shown
  const parents = countParents(allParagraphs);
  const maxId = getMaxId(parents);

  let contentParent = allElements[maxId];
  let ratio = 0;
  let count = 0;

  do {
    const contentParagraphs = $("p", contentParent);
    const contentParagraphsCount = contentParagraphs.length;
    ratio = contentParagraphsCount / totalParagraphs;

    if (ratio < MIN_RATIO) {
      const id = contentParent.parentId ?? 0;
      contentParent = allElements[id];
    }

    // prevent infinite loops
    count++;
  } while (contentParent && ratio <= MIN_RATIO && count < 4);

  return contentParent;
}

function nothing(o: ParserOptions) {
  return `<p><a href="${o.url}" target="_blank">${o.url}</a></p>`;
}

function countParents(allParagraphs: CustomNodeElement[]) {
  const parents: Record<number | string, number> = {};

  allParagraphs.forEach(function (element) {
    const id = element.parentId || "";
    parents[id] = parents[id] || 0;
    parents[id]++;
  });

  return parents;
}

function getMaxId(obj: Record<number, number>) {
  let max = -1;
  let maxId = -1;

  for (const id in obj) {
    if (obj.hasOwnProperty(id)) {
      const nId = Number(id);
      const value = obj[nId];

      if (value > max) {
        max = value;
        maxId = nId;
      }
    }
  }

  return maxId;
}

function stringify(json: HimalayaElement[]) {
  const output = himalaya
    .stringify(json)
    .replace(/<html>/g, "")
    .replace(/<body>/g, "")
    .replace(/<div>/g, "")
    .replace(/<span>/g, "")
    .replace(/<\/html>/g, "")
    .replace(/<\/body>/g, "")
    .replace(/<\/div>/g, "")
    .replace(/<\/span>/g, "");

  return addSomeSpaces(output);
}

function addSomeSpaces(str: string) {
  // this will add a space before each anchor tag, except for those
  // preceded by: ( " [ { - – — _ ~ @

  // the reason to do this is to prevent space collapsing before links
  return str.replace(/([^\(\"\[\{\-\–\—\_\~\@])<a/gi, "$1 <a");
}

export default parse;
