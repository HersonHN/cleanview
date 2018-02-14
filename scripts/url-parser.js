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
    let isFullPath = url.indexOf('//') > -1;

    if (isFullPath) return attr;

    url = addBase(base, url);
    attr.value = url;

    return attr;
  });
}


function addBase(textBase, textURL) {
  if (textURL.indexOf('base64') > 0) return textURL;
  
  let base = parse(textBase);
  let url = parse(textURL);

  // if the url is relative
  if (url.pathname.indexOf('/') != 0) {
    let baseURL = removeLastToken(base.pathname);
    let relativeURL = url.pathname;
    let mergedURL = join(baseURL, relativeURL);

    url.set('pathname', mergedURL);
  }

  url.set('host', base.host);
  url.set('hostname', base.hostname);
  url.set('protocol', base.protocol);
  url.set('host', base.host);
  url.set('origin', base.origin);

  return url.href;
}

function removeLastToken(string) {
  let tokens = string.split('/');
  tokens.pop();
  return tokens.join('/') + '/';
}


module.exports = { addBaseUrl };
