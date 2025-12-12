'use strict';

const join = require('iso-path-join');
const parse = require('url-parse');


function addBaseUrl(elements, baseURL) {
  for (let id in elements) {
    if (elements.hasOwnProperty(id)) {
      let el = elements[id];
      if (el.tagName === 'a') fixUrl(el, 'href', baseURL);
      if (el.tagName === 'img') fixUrl(el, 'src', baseURL);
    }
  }
}


function fixUrl(element, prop, base) {
  element.attributes = element.attributes.map(function (attr) {
    if (attr.key !== prop) return attr;
    let url = attr.value;
    url = merge(base, url);
    attr.value = url;

    return attr;
  });
}


function merge(textBase, textURL) {
  textURL = (textURL || '').trim();

  if (textURL.indexOf('//') > -1) return textURL;
  if (textURL.indexOf('base64') > -1) return textURL;

  let url = parse(textURL, textBase);

  return url.href;
}

function removeLastToken(string) {
  let tokens = string.split('/');
  tokens.pop();
  return tokens.join('/') + '/';
}


module.exports = { addBaseUrl, merge };
