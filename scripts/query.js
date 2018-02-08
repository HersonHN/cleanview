'use strict';

function $(tag, json, returned) {
  returned = returned || [];

  json.forEach(function (el) {
    if (el.tagName === tag) {
      returned.push(el);
    } else {
      if (el.children) $(tag, el.children, returned);
    }
  })

  return returned;
}

module.exports = $;
