'use strict';

/*
  It's better to just work with the valid tags instead of removing
  all the invalid ones, which can be difficult for obscure tagnames
*/
const VALID_TAGS = [
  'html', 'body',
  'div', 'main', 'section', 'article', 'quote', 'blockquote',
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr',
  'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'span', 'small', 'sub', 'sup',
  'b', 'i', 'u', 's', 'em', 'strong', 'q', 'font', 'center',
  'img', 'figure', 'figcaption', 'picture',
  'pre', 'code', 'xmp',
  'iframe' // this will render only for videos
];


const VALID_TAGS_SECOND_TRY = [
  ...VALID_TAGS, 'header'
];

// TODO: forbidden classes might be passed as a parameter in the main function's config
const FORBIDDEN_CLASSES = ['menu', 'navigation', 'side', 'submeta', 'hidden', 'hide', 'newsletter', 'button', 'form'];


const ATTRIBUTES_TO_KEEP = {
  IMAGE: ['src', 'title', 'alt'],
  LINK: ['href', 'title'],
  SOURCE: ['srcset'],
  YOUTUBE: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
  OTHER: [],
  INVALID: []
}

function clean(json, options) {
  options = options || {};

  json = cleanOuterToInner(json, options);
  json = cleanInnerToOuter(json, options);

  return json;
}


function cleanOuterToInner(json, options) {
  json = json
    .filter(e => filterComments(e, options))
    .filter(e => filterSpaces(e, options))
    .filter(e => filterTags(e, options))
    .filter(e => filterClasses(e, options))
    .map(e => cleanAttributes(e, options))
    .map(e => passToChildren(e, options, cleanOuterToInner))
    
  return json;
}

function cleanInnerToOuter(json, options) {
  json = json
    .map(e => passToChildren(e, options, cleanInnerToOuter))
    .filter(e => filterEmptyNodes(e, options))

  return json;
}


function filterEmptyNodes(e) {
  if (e.type == 'text') return true;
  if (e.tagName == 'img') return true;
  if (e.tagName == 'iframe') return true;
  if (e.tagName == 'br') return true;
  if (e.tagName == 'hr') return true;

  if (!e.children) return true;

  return (e.children.length > 0);
}


function filterComments(e, options) {
  return (e.type == 'text' || e.type == 'element');
}


function filterSpaces(e, options) {
  return !(e.type == 'text' && e.content.trim() == '');
}


function filterTags(e, options) {
  let TAGS = options.secondTry ? VALID_TAGS_SECOND_TRY : VALID_TAGS;

  let tag = (e.tagName || '').toLowerCase();
  let isText = (e.type === 'text');
  let isValidTag = (TAGS.indexOf(tag) > -1);

  return (isText || isValidTag);
}


function filterClasses(e, options) {
  if (options.includeClasses) return true;

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


function passToChildren(e, options, func) {
  if (!e) return e;

  if (e.children && e.children.length > 0) {
    e.children = func(e.children, options, func);
  }

  return e;
}


function cleanAttributes(e, options) {
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
  if (e.tagName === 'source') return 'SOURCE';

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

module.exports = { clean };
