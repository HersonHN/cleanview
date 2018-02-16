'use strict';

const himalaya = require('himalaya');

const filters = require('./filters');
const modifiers = require('./modifiers');
const urlParser = require('./url-parser');
const $ = require('./query');


function parse(html, options) {
  options = options || {};

  let { allElements, allParagraphs, clearedJSON } = parseJSON(html, options);

  // If there's no paragraphs from the search, try again without filtering classes
  if (!allParagraphs.length) {
    options.includeClasses = true;

    let result = parseJSON(html, options);

    allParagraphs = result.allParagraphs;
    allElements = result.allElements;
    clearedJSON = result.clearedJSON;
  }

  // if it's the second time around
  if (!allParagraphs.length) {
    return nothing(options);
  }

  // the element with more paragraphs will be the the one shown
  let parents = countParents(allParagraphs);
  let maxId = getMaxId(parents);


  let contentParent = allElements[maxId];

  return stringify([contentParent]);
}


function parseJSON(html, options) {
  let url = options.url || '';

  let json = himalaya.parse(html);

  // clean the elements
  let clearedJSON = filters.clean(json, options);

  // add ids to each one
  let allElements = modifiers.addIds(clearedJSON);

  // fix all the relative urls
  urlParser.addBaseUrl(allElements, url);

  let allParagraphs = $('p', clearedJSON);

  return { allParagraphs, clearedJSON, allElements };
}


function nothing(o) {
  return `<p><a href="${o.url}" target="_blank">${o.url}</a></p>`;
}


function countParents(allParagraphs) {
  let parents = {};
  allParagraphs.forEach(function (element) {
    let id = element.parentId;
    parents[id] = parents[id] || 0;
    parents[id]++;
  });

  return parents;
}


function getMaxId(obj) {
  let max = -1;
  let maxId = -1;

  for (let id in obj) {
    if (obj.hasOwnProperty(id)) {
      let value = obj[id];

      if (value > max) {
        max = value;
        maxId = id;
      }
    }
  }

  return maxId;
}


function stringify(json) {
  let output = himalaya.stringify(json);
  output = output.replace(/<\/p>/g, '</p>\n');

  return output
    .replace(/<span>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '');
}



module.exports = parse;
