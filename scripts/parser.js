'use strict';

const himalaya = require('himalaya');

const filters = require('./filters');
const modifiers = require('./modifiers');
const urlParser = require('./url-parser');
const $ = require('./query');


function parse(html, options) {
  options = options || {};
  let url = options.url || '';

  let json = himalaya.parse(html);
  let clearedJSON = filters.clear(json)[0];

  let allElements = modifiers.addModifiers(clearedJSON);

  if (url) {
    urlParser.addBaseUrl(allElements, url);
  }

  let allParagraphs = $('p', clearedJSON);

  let parents = countParents(allParagraphs);
  let maxId = getMaxId(parents);

  let contentParent = allElements[maxId];
  let text = stringify([contentParent]);

  return cleanText(text);
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
  return output;
}


function cleanText(text) {
  return text
    .replace(/<span>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '');
}


module.exports = parse;
