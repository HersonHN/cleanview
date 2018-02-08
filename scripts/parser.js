'use strict';

const himalaya = require('himalaya');

const filters = require('./filters');
const $ = require('./query');


function parse(html) {
  let json = himalaya.parse(html);
  let clearedJSON = filters.clear(json);
  let paragraphs = $('p', clearedJSON);

  return stringify(paragraphs);
}


function stringify(json) {
  let output = himalaya.stringify(json);
  output = output.replace(/<\/p>/g, '</p>\n');
  return output;
}


module.exports = parse;
