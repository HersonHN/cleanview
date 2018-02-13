'use strict';

const FORBIDDEN_CLASSES = ['menu', 'navigation', 'side', 'submeta', 'hidden', 'hide', 'newsletter', 'button', 'form'];

/*
  It's better to just work with the valid tags instead of removing
  all the invalid ones, which can be difficult for obscure tagnames
*/
const VALID_TAGS = [
  'html', 'body',
  'div', 'main', 'section', 'article',
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'span', 'em', 'strong', 'small', 'sub', 'sup',
  'b', 'i', 'u', 's',
  'img', 'figure', 'figcaption',
  'pre', 'code',
  'iframe' // this will work only for youtube videos
];


function clear(json) {
  json = json
    .filter(filterSpaces)
    .filter(filterTags)
    .filter(filterClasses)
    .map(clearAttributes)
    .map(cleanChildren)

  return json;
}


function filterSpaces(e) {
  return !(e.type == 'text' && e.content.trim() == '');
}


function filterTags(e) {
  let tag = (e.tagName || '').toLowerCase();
  let isText = (e.type === 'text');
  let isValidTag = (VALID_TAGS.indexOf(tag) > -1);

  return (isText || isValidTag);
}


function filterClasses(e) {
  let className = findClass(e);
  let found = false;

  FORBIDDEN_CLASSES.forEach(function (forbidden) {
    if (className.indexOf(forbidden) > -1) {
      found = true;
    }
  })

  return !found;
}


function findClass(e) {
  return findProp(e, 'class').toLowerCase();
}


function findProp(e, prop) {
  if (!e.attributes) return '';

  let pair = e.attributes.find(a => a.key === prop);
  if (pair) return pair.value;

  return '';
}


function cleanChildren(e) {
  if (e.children && e.children.length > 0) {
    e.children = clear(e.children);
  }

  return e;
}


function clearAttributes(e) {
  if (e.type != 'element') return e;

  let isImage = (e.tagName === 'img');
  let isAnchor = (e.tagName === 'a');
  let isIFrame = (e.tagName === 'iframe');

  let isYoutube = false;
  if (isIFrame) {
    let src = findProp(e, 'src');
    isYoutube = (src.indexOf('youtube.com') > 0 || src.indexOf('youtu.be') > 0);
  }

  let isAnother = !isImage && !isAnchor && !isYoutube;

  if (isAnother) e.attributes = [];
  if (isImage) keepAttributes(e, ['src', 'title', 'alt']);
  if (isYoutube) keepAttributes(e, ['src', 'width', 'height', 'allowfullscreen', 'frameborder']);
  if (isAnchor) {
    keepAttributes(e, ['href', 'title']);
    e.attributes.push({ key: 'target', value: '_blank' });
  }
  if (isIFrame && !isYoutube) {
    e.tagName = 'div';
    e.children = [];
  }

  return e;
}


function keepAttributes(e, list) {
  e.attributes = e.attributes
    .filter(attr => attr.value && list.indexOf(attr.key) > -1);
  return e;
}

module.exports = {
  clear,
  filterSpaces,
  filterTags,
  filterClasses,
  findClass,
  cleanChildren,
  clearAttributes,
  keepAttributes
};
