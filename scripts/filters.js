'use strict';

const VALID_TAGS = require('../defaults/valid-tags');
const FORBIDDEN_CLASSES = require('../defaults/forbidden-classes');

const VALID_TAGS_SECOND_TRY = [
  ...VALID_TAGS, 'header'
];

const ATTRIBUTES_TO_KEEP = {
  IMAGE: ['src', 'title', 'alt', 'data-src'],
  LINK: ['href', 'title'],
  SOURCE: ['srcset'],
  YOUTUBE: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
  OTHER: [],
  INVALID: []
}

function clean(json, options) {
  options = options || {};

  json = addFlags(json, options);

  json = cleanOuterToInner(json, options);
  json = cleanInnerToOuter(json, options);

  return json;
}


function addFlags(json, options) {
  json = addFlagForPre(json, options);

  return json;
}


function addFlagForPre(json, options) {
  return json.map(e => iterateChildren(e, options, (child, options, parent) => {
      if (parent.tagName === 'pre' || parent.insidePre) {
        child.insidePre = true;
      }
      return child;
    }))
}


function iterateChildren(element, options, func) {
  if (!element) return element;

  if (!element.children) return element;
  if (!element.children.length) return element;

  element.children = element.children
    .map(child => {
      let modified = func(child, options, element);
      iterateChildren(child, options, func);
      return modified;
    })

  return element;
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
  // do not remove spaces when inside a <pre> tag
  if (e.insidePre) return true;
  let blankSpace = (e.type == 'text' && e.content.trim() == '');
  return !blankSpace;
}


function filterTags(e, options) {
  let TAGS = options.secondTry ? VALID_TAGS_SECOND_TRY : VALID_TAGS;

  let aditionalTags = options.includeTags || [];
  let tags = [...TAGS, ...aditionalTags];

  let tag = (e.tagName || '').toLowerCase();
  let isText = (e.type === 'text');
  let isValidTag = (tags.indexOf(tag) > -1);

  return (isText || isValidTag);
}


function filterClasses(e, options) {
  if (options.includeClasses) return true;
  let forbiddenClasses = options.forbiddenClasses || [];
  let FORBIDDEN = [...FORBIDDEN_CLASSES, ...forbiddenClasses];

  let className = getClass(e);
  let found = false;

  FORBIDDEN.forEach(function (forbidden) {
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

  if (type === 'IMAGE') {
    // Adding the `data-src` prop as the src for the image
    // this fix lazyloading images

    let src = getProp(e, 'src');
    let dataSRC = getProp(e, 'data-src');
    if (!src && dataSRC) {
      e.attributes.push({ key: 'src', value: dataSRC });
    }
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
    .map(a => ({ key: a.key.toLowerCase(), value: a.value }))
    .filter(attr => attr.value && list.indexOf(attr.key) > -1)
  return e;
}

module.exports = { clean };
