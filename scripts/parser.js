'use strict';

const himalaya = require('himalaya');

const filters = require('./filters');
const modifiers = require('./modifiers');
const urlParser = require('./url-parser');
const $ = require('./query');

const MIN_RATIO = 0.75;

function parse(html, options) {
  options = options || {};
  options.url = options.url || '';

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

  let contentElement = getContentElement(allElements, allParagraphs);

  return stringify([contentElement]);
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


function getContentElement(allElements, allParagraphs) {
  let totalParagraphs = allParagraphs.length;

  // the element with more paragraphs will be the the one shown
  let parents = countParents(allParagraphs);
  let maxId = getMaxId(parents);

  let contentParent = allElements[maxId];

  let ratio = 0;
  let count = 0;
  do {
    let contentParagraphs = $('p', contentParent);
    let contentParagraphsCount = contentParagraphs.length;
    ratio = contentParagraphsCount / totalParagraphs;

    if (ratio < MIN_RATIO) {
      let id = contentParent.parentId;
      contentParent = allElements[id];
    }

    // prevent infinite loops
    count++;

  } while (contentParent && ratio <= MIN_RATIO && count < 4);

  return contentParent;
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

  output
    .replace(/<html>/g, '')
    .replace(/<body>/g, '')
    .replace(/<div>/g, '')
    .replace(/<span>/g, '')
    .replace(/<\/html>/g, '')
    .replace(/<\/body>/g, '')
    .replace(/<\/div>/g, '')
    .replace(/<\/span>/g, ' ');
  
  return addSomeSpaces(output);
}

function addSomeSpaces(str) {
  // @NOTE: Sadly I'll forget what this regex do.
  
  // The idea is to add a single space between a closing tag and a opening tag
  // who follows it.

  // So a group of tags like this:
  // <p><span></span><span></span><b><a></a></b></p><i><a></a><a></a></i>
  // will turn into this:
  // <p><span></span> <span></span> <b><a></a></b></p> <i><a></a> <a></a></i>
  
  // The reason to do this is because, if there's two anchor tags with nothing 
  // between them, like: [A link][Another link], on the browser they would look
  // like [A linkAnother link], and that ruins the readability of the text.

  return str.replace(/(<\/[^>]+><)([^\/])/g, found => found.replace('><', '> <'));
}


module.exports = parse;
