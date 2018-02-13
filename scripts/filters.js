'use strict';

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
  'iframe' // this will render only for videos
];


// TODO: forbidden classes might be passed as a parameter in the main function's config
const FORBIDDEN_CLASSES = ['menu', 'navigation', 'side', 'submeta', 'hidden', 'hide', 'newsletter', 'button', 'form'];


const ATTRIBUTES_TO_KEEP = {
  IMAGE: ['src', 'title', 'alt'],
  LINK: ['href', 'title'],
  YOUTUBE: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
  OTHER: [],
  INVALID: []
}


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
  let className = getClass(e);
  let found = false;

  FORBIDDEN_CLASSES.forEach(function (forbidden) {
    if (className.indexOf(forbidden) > -1) {
      found = true;
    }
  })

  return !found;
}


function getClass(e) {
  return getProp(e, 'class').toLowerCase();
}


function getProp(e, prop) {
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

  let type = getElementType(e);
  let attributeList = ATTRIBUTES_TO_KEEP[type];

  keepAttributes(e, attributeList);

  // make sure invalid elements don't get rendered to html
  if (type === 'INVALID') {
    e.tagName = 'div';
    e.children = [];
  }

  if (type === 'LINK') {
    e.attributes.push({ key: 'target', value: '_blank' });
  }

  return e;
}


function getElementType(e) {
  if (e.tagName === 'img') return 'IMAGE';
  if (e.tagName === 'a') return 'LINK';

  let isIFrame = (e.tagName === 'iframe');

  if (isIFrame) {
    let src = getProp(e, 'src');

    // TODO: add support to other platforms
    let isYoutube = (src.indexOf('youtube.com') > 0 || src.indexOf('youtu.be') > 0);
    if (isYoutube) return 'YOUTUBE';
  }

  // if is not a youtube video, but is still an iframe, return invalid
  if (isIFrame) return 'INVALID';

  return 'OTHER';
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
  getClass,
  cleanChildren,
  clearAttributes,
  keepAttributes
};
