'use strict';

const himalaya = require('himalaya');

const filters = require('./filters');
const $ = require('./query');


function parse(html) {
  let json = himalaya.parse(html);
  let clearedJSON = filters.clear(json);
  let paragraphs = $('p', clearedJSON);
  let text = stringify(paragraphs);

  return cleanText(text);
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
