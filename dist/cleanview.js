var cleanview=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e,r){"use strict";function n(t){return"number"==typeof t&&isNaN(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.startsWith=function(t,e,r){return t.substr(r||0,e.length)===e},e.endsWith=function(t,e,r){var n=(r||t.length)-e.length,o=t.lastIndexOf(e,n);return-1!==o&&o===n},e.stringIncludes=function(t,e,r){return-1!==t.indexOf(e,r||0)},e.isRealNaN=n,e.arrayIncludes=function(t,e,r){var o=t.length;if(0===o)return!1;var a=0|r,s=n(e),i=a>=0?a:o+a;for(;i<o;){var u=t[i++];if(u===e)return!0;if(s&&n(u))return!0}return!1}},function(t,e,r){"use strict";t.exports=r(2)},function(t,e,r){"use strict";var n=r(3),o=r(9),a=r(10),s=r(11),i=r(17),u=.8;function c(t,e){var r=e.url||"",u=n.parse(t),c=o.clean(u,e),l=a.addIds(c);return s.addBaseUrl(l,r),{allParagraphs:i("p",c),clearedJSON:c,allElements:l}}t.exports=function(t,e){(e=e||{}).url=e.url||"";var r,o=c(t,e),a=o.allElements,s=o.allParagraphs;if(o.clearedJSON,!s.length){e.includeClasses=!0;var l=c(t,e);s=l.allParagraphs,a=l.allElements,l.clearedJSON}if(!s.length)return'<p><a href="'+(r=e).url+'" target="_blank">'+r.url+"</a></p>";var f,p=function(t,e){var r=e.length,n=function(t){var e=-1,r=-1;for(var n in t)if(t.hasOwnProperty(n)){var o=t[n];o>e&&(e=o,r=n)}return r}(function(t){var e={};return t.forEach(function(t){var r=t.parentId;e[r]=e[r]||0,e[r]++}),e}(e)),o=t[n],a=0,s=0;do{var c=i("p",o),l=c.length;if((a=l/r)<u){var f=o.parentId;o=t[f]}s++}while(o&&a<=u&&s<4);return o}(a,s);return f=[p],n.stringify(f).replace(/<html>/g,"").replace(/<body>/g,"").replace(/<div>/g,"").replace(/<span>/g,"").replace(/<\/html>/g,"").replace(/<\/body>/g,"").replace(/<\/div>/g,"").replace(/<\/span>/g,"")}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.parseDefaults=void 0,e.parse=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c,r=(0,n.default)(t,e),s=(0,o.default)(r,e);return(0,a.format)(s,e)},e.stringify=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c;return(0,s.toHTML)(t,e)};var n=u(r(4)),o=u(r(5)),a=r(6),s=r(7),i=r(8);function u(t){return t&&t.__esModule?t:{default:t}}var c=e.parseDefaults={voidTags:i.voidTags,closingTags:i.closingTags,childlessTags:i.childlessTags,closingTagAncestorBreakers:i.closingTagAncestorBreakers}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var r={str:t,options:e,cursor:0,tokens:[]};return a(r),r.tokens},e.lex=a,e.findTextEnd=i,e.lexText=u,e.lexComment=c,e.lexTag=l,e.isWhitespaceChar=p,e.lexTagName=h,e.lexTagAttributes=d,e.lexSkipTag=v;var n=r(0);function o(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}function a(t){for(var e=t.str,r=e.length;t.cursor<r;){var o=t.cursor;if(u(t),t.cursor===o)if((0,n.startsWith)(e,"!--",t.cursor+1))c(t);else{var a=l(t),s=a.toLowerCase(),i=t.options.childlessTags;(0,n.arrayIncludes)(i,s)&&v(a,t)}}}var s=/[A-Za-z0-9]/;function i(t,e){for(;;){var r=t.indexOf("<",e);if(-1===r)return r;var n=t.charAt(r+1);if("/"===n||"!"===n||s.test(n))return r;e=r+1}}function u(t){var e=t.str,r=t.cursor,n=i(e,r);if(-1===n){var o=e.slice(r);return t.cursor=e.length,void t.tokens.push({type:"text",content:o})}if(n!==r){var a=e.slice(r,n);t.cursor=n,t.tokens.push({type:"text",content:a})}}function c(t){t.cursor+=4;var e=t.str,r=t.cursor,n=e.indexOf("--\x3e",r);if(-1===n){var o=e.slice(r);return t.cursor=e.length,void t.tokens.push({type:"comment",content:o})}var a=e.slice(r,n);t.cursor=n+3,t.tokens.push({type:"comment",content:a})}function l(t){var e=t.str,r="/"===e.charAt(t.cursor+1);t.tokens.push({type:"tag-start",close:r}),t.cursor+=r?2:1;var n=h(t);d(t);var o="/"===e.charAt(t.cursor);return t.tokens.push({type:"tag-end",close:o}),t.cursor+=o?2:1,n}var f=/\s/;function p(t){return f.test(t)}function h(t){for(var e=t.str,r=t.cursor,n=e.length,o=r;o<n;){var a=e.charAt(o);if(!(p(a)||"/"===a||">"===a))break;o++}for(var s=o+1;s<n;){var i=e.charAt(s);if(!!(p(i)||"/"===i||">"===i))break;s++}t.cursor=s;var u=e.slice(o,s);return t.tokens.push({type:"tag",content:u}),u}function d(t){for(var e=t.str,r=t.tokens,o=t.cursor,a=null,s=o,i=[],u=e.length;o<u;){var c=e.charAt(o);if(a){c===a&&(a=null),o++}else{if("/"===c||">"===c){o!==s&&i.push(e.slice(s,o));break}if(p(c))o!==s&&i.push(e.slice(s,o)),s=o+1,o++;else"'"===c||'"'===c?(a=c,o++):o++}}t.cursor=o;for(var l=i.length,f="attribute",h=0;h<l;h++){var d=i[h];if(-1===d.indexOf("=")){var v=i[h+1];if(v&&(0,n.startsWith)(v,"=")){if(v.length>1){var g=d+v;r.push({type:f,content:g}),h+=1;continue}var y=i[h+2];if(h+=1,y){var m=d+"="+y;r.push({type:f,content:m}),h+=1;continue}}}if((0,n.endsWith)(d,"=")){var b=i[h+1];if(b&&!(0,n.stringIncludes)(b,"=")){var x=d+b;r.push({type:f,content:x}),h+=1;continue}var k=d.slice(0,-1);r.push({type:f,content:k})}else r.push({type:f,content:d})}}function v(t,e){for(var r=e.str,n=e.cursor,a=e.tokens,s=r.length,i=n;i<s;){var c=r.indexOf("</",i);if(-1===c){u(e);break}var l={str:r,cursor:c+2,tokens:[]},f=h(l);if(t.toLowerCase()===f.toLowerCase()){var p=r.slice(n,c);a.push({type:"text",content:p});d(l),a.push.apply(a,[{type:"tag-start",close:!0}].concat(o(l.tokens),[{type:"tag-end",close:!1}])),e.cursor=l.cursor+1;break}i=l.cursor}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){var r={tagName:null,children:[]};return a({tokens:t,options:e,cursor:0,stack:[r]}),r.children},e.hasTerminalParent=o,e.parse=a;var n=r(0);function o(t,e,r){var o=r[t];if(o)for(var a=e.length-1;a>=0;){var s=e[a].tagName;if(s===t)break;if((0,n.arrayIncludes)(o,s))return!0;a--}return!1}function a(t){for(var e=t.tokens,r=t.options,s=t.stack,i=s[s.length-1].children,u=e.length,c=t.cursor;c<u;){var l=e[c];if("tag-start"===l.type){var f=e[++c];c++;var p=f.content.toLowerCase();if(l.close){for(var h=void 0;(h=s.pop())&&p!==h.tagName;);for(;c<u;){if("tag-end"!==e[c].type)break;c++}break}var d=(0,n.arrayIncludes)(r.closingTags,p);if(d)d=!o(p,s,r.closingTagAncestorBreakers);if(d)for(var v=s.length-1;v>0;){if(p===s[v].tagName){i=(s=s.slice(0,v))[v-1].children;break}v-=1}for(var g=[],y=void 0;c<u&&"tag-end"!==(y=e[c]).type;)g.push(y.content),c++;c++;var m=[];if(i.push({type:"element",tagName:f.content,attributes:g,children:m}),!(y.close||(0,n.arrayIncludes)(r.voidTags,p))){s.push({tagName:p,children:m});var b={tokens:e,options:r,cursor:c,stack:s};a(b),c=b.cursor}}else i.push(l),c++}t.cursor=c}},function(t,e,r){"use strict";function n(t,e){var r=t.indexOf(e);return-1===r?[t]:[t.slice(0,r),t.slice(r+e.length)]}function o(t){var e=t.charAt(0),r=t.length-1;return('"'===e||"'"===e)&&e===t.charAt(r)?t.slice(1,r):t}function a(t){return t.map(function(t){var e=n(t.trim(),"=");return{key:e[0],value:"string"==typeof e[1]?o(e[1]):null}})}Object.defineProperty(e,"__esModule",{value:!0}),e.splitHead=n,e.unquote=o,e.format=function t(e){return e.map(function(e){var r=e.type;if("element"===r){var n=e.tagName.toLowerCase(),o=a(e.attributes),s=t(e.children);return{type:r,tagName:n,attributes:o,children:s}}return{type:r,content:e.content}})},e.formatAttributes=a},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.formatAttributes=o,e.toHTML=a;var n=r(0);function o(t){return t.reduce(function(t,e){var r=e.key,n=e.value;if(null===n)return t+" "+r;var o=-1!==n.indexOf("'")?'"':"'";return t+" "+r+"="+o+n+o},"")}function a(t,e){return t.map(function(t){if("text"===t.type)return t.content;if("comment"===t.type)return"\x3c!--"+t.content+"--\x3e";var r=t.tagName,s=t.attributes,i=t.children;return(0,n.arrayIncludes)(e.voidTags,r.toLowerCase())?"<"+r+o(s)+">":"<"+r+o(s)+">"+a(i,e)+"</"+r+">"}).join("")}e.default={toHTML:a}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.childlessTags=["style","script","template"],e.closingTags=["html","head","body","p","dt","dd","li","option","thead","th","tbody","tr","td","tfoot","colgroup"],e.closingTagAncestorBreakers={li:["ul","ol","menu"],dt:["dl"],dd:["dl"],tbody:["table"],thead:["table"],tfoot:["table"],tr:["table"],td:["table"]},e.voidTags=["!doctype","area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]},function(t,e,r){"use strict";var n=["html","body","div","main","section","article","p","h1","h2","h3","h4","h5","h6","br","hr","ul","ol","li","table","thead","tbody","tr","th","td","a","span","small","sub","sup","b","i","u","s","em","strong","img","figure","figcaption","picture","pre","code","iframe"],o=["menu","navigation","side","submeta","hidden","hide","newsletter","button","form"],a={IMAGE:["src","title","alt"],LINK:["href","title"],YOUTUBE:["src","width","height","allowfullscreen","frameborder"],OTHER:[],INVALID:[]};function s(t,e){return t=t.filter(function(t){return function(t,e){return"text"==t.type||"element"==t.type}(t)}).filter(function(t){return function(t,e){return!("text"==t.type&&""==t.content.trim())}(t)}).filter(function(t){return function(t,e){var r=(t.tagName||"").toLowerCase(),o="text"===t.type,a=n.indexOf(r)>-1;return o||a}(t)}).filter(function(t){return function(t,e){if(e.includeClasses)return!0;var r=function(t){return u(t,"class").toLowerCase()}(t),n=!1;return o.forEach(function(t){r.indexOf(t)>-1&&(n=!0)}),!n}(t,e)}).map(function(t){return function(t,e){if("element"!=t.type)return t;var r=function(t){if("img"===t.tagName)return"IMAGE";if("a"===t.tagName)return"LINK";var e="iframe"===t.tagName;if(e){var r=u(t,"src"),n=r.indexOf("youtube.com")>0||r.indexOf("youtu.be")>0;if(n)return"YOUTUBE"}return e?"INVALID":"OTHER"}(t),n=a[r];(function(t,e){t.attributes=t.attributes.filter(function(t){return t.value&&e.indexOf(t.key)>-1})})(t,n),"INVALID"===r&&(t.tagName="div",t.children=[]);"LINK"===r&&t.attributes.push({key:"target",value:"_blank"});return t}(t)}).map(function(t){return c(t,e,s)})}function i(t,e){return t=t.map(function(t){return c(t,e,i)}).filter(function(t){return function(t){return"text"==t.type||"img"==t.tagName||"iframe"==t.tagName||"br"==t.tagName||"hr"==t.tagName||t.children.length>0}(t)})}function u(t,e){if(!t.attributes)return"";var r=t.attributes.find(function(t){return t.key===e});return r?r.value:""}function c(t,e,r){return t?(t.children&&t.children.length>0&&(t.children=r(t.children,e,r)),t):t}t.exports={clean:function(t,e){return t=i(t=s(t,e=e||{}),e)}}},function(t,e,r){"use strict";t.exports={addIds:function(t){var e={},r=1;return function t(e,r,n){n=n||{},Array.isArray(e)?e.forEach(function(e){t(e,r,n)}):("element"===e.type&&r(e,n),e.children&&e.children.forEach(function(n){t(n,r,e)}))}(t,function(t,n){if(t){var o=r++;t.id=o,t.parentId=n.id,e[o]=t}}),e}}},function(t,e,r){"use strict";var n=r(12),o=r(13);function a(t,e,r){t.attributes=t.attributes.map(function(t){if(t.key!==e)return t;var a=t.value;return a.indexOf("//")>-1?t:(a=function(t,e){if(e.indexOf("base64")>0)return e;var r=o(t),a=o(e);if(0!=a.pathname.indexOf("/")){var s=(c=r.pathname,(l=c.split("/")).pop(),l.join("/")+"/"),i=a.pathname,u=n(s,i);a.set("pathname",u)}var c,l;return a.set("host",r.host),a.set("hostname",r.hostname),a.set("protocol",r.protocol),a.set("host",r.host),a.set("origin",r.origin),a.href}(r,a),t.value=a,t)})}t.exports={addBaseUrl:function(t,e){for(var r in t)if(t.hasOwnProperty(r)){var n=t[r];"a"===n.tagName&&a(n,"href",e),"img"===n.tagName&&a(n,"src",e)}}}},function(t,e,r){"use strict";var n=/\.{3,}/g;Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)});var o="tried to join something other than a string or array, it was ignored in pathJoin's result";function a(t,e){var r=!t.length,n="/"===t[t.length-1],o="/"===e[0];return n&&o&&t+e.slice(1)||!n&&!o&&!r&&t+"/"+e||t+e}t.exports=function t(){return Array.prototype.slice.call(arguments).reduce(function(e,r){if(void 0!==e)return"string"==typeof r||"number"==typeof r?a(e,""+r):Array.isArray(r)?a(e,t.apply(null,r)):(console.error?console.error(o):console.log(o))||""},"").replace(n,"..")}},function(t,e,r){"use strict";(function(e){var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=r(15),a=r(16),s=/^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,i=/^[A-Za-z][A-Za-z0-9+-.]*:\/\//,u=[["#","hash"],["?","query"],["/","pathname"],["@","auth",1],[NaN,"host",void 0,1,1],[/:(\d+)$/,"port",void 0,1],[NaN,"hostname",void 0,1,1]],c={hash:1,query:1};function l(t){var r,o={},a=void 0===(t=t||e.location||{})?"undefined":n(t);if("blob:"===t.protocol)o=new p(unescape(t.pathname),{});else if("string"===a)for(r in o=new p(t,{}),c)delete o[r];else if("object"===a){for(r in t)r in c||(o[r]=t[r]);void 0===o.slashes&&(o.slashes=i.test(t.href))}return o}function f(t){var e=s.exec(t);return{protocol:e[1]?e[1].toLowerCase():"",slashes:!!e[2],rest:e[3]}}function p(t,e,r){if(!(this instanceof p))return new p(t,e,r);var s,i,c,h,d,v,g=u.slice(),y=void 0===e?"undefined":n(e),m=this,b=0;for("object"!==y&&"string"!==y&&(r=e,e=null),r&&"function"!=typeof r&&(r=a.parse),e=l(e),s=!(i=f(t||"")).protocol&&!i.slashes,m.slashes=i.slashes||s&&e.slashes,m.protocol=i.protocol||e.protocol||"",t=i.rest,i.slashes||(g[2]=[/(.*)/,"pathname"]);b<g.length;b++)c=(h=g[b])[0],v=h[1],c!=c?m[v]=t:"string"==typeof c?~(d=t.indexOf(c))&&("number"==typeof h[2]?(m[v]=t.slice(0,d),t=t.slice(d+h[2])):(m[v]=t.slice(d),t=t.slice(0,d))):(d=c.exec(t))&&(m[v]=d[1],t=t.slice(0,d.index)),m[v]=m[v]||s&&h[3]&&e[v]||"",h[4]&&(m[v]=m[v].toLowerCase());r&&(m.query=r(m.query)),s&&e.slashes&&"/"!==m.pathname.charAt(0)&&(""!==m.pathname||""!==e.pathname)&&(m.pathname=function(t,e){for(var r=(e||"/").split("/").slice(0,-1).concat(t.split("/")),n=r.length,o=r[n-1],a=!1,s=0;n--;)"."===r[n]?r.splice(n,1):".."===r[n]?(r.splice(n,1),s++):s&&(0===n&&(a=!0),r.splice(n,1),s--);return a&&r.unshift(""),"."!==o&&".."!==o||r.push(""),r.join("/")}(m.pathname,e.pathname)),o(m.port,m.protocol)||(m.host=m.hostname,m.port=""),m.username=m.password="",m.auth&&(h=m.auth.split(":"),m.username=h[0]||"",m.password=h[1]||""),m.origin=m.protocol&&m.host&&"file:"!==m.protocol?m.protocol+"//"+m.host:"null",m.href=m.toString()}p.prototype={set:function(t,e,r){var n=this;switch(t){case"query":"string"==typeof e&&e.length&&(e=(r||a.parse)(e)),n[t]=e;break;case"port":n[t]=e,o(e,n.protocol)?e&&(n.host=n.hostname+":"+e):(n.host=n.hostname,n[t]="");break;case"hostname":n[t]=e,n.port&&(e+=":"+n.port),n.host=e;break;case"host":n[t]=e,/:\d+$/.test(e)?(e=e.split(":"),n.port=e.pop(),n.hostname=e.join(":")):(n.hostname=e,n.port="");break;case"protocol":n.protocol=e.toLowerCase(),n.slashes=!r;break;case"pathname":case"hash":if(e){var s="pathname"===t?"/":"#";n[t]=e.charAt(0)!==s?s+e:e}else n[t]=e;break;default:n[t]=e}for(var i=0;i<u.length;i++){var c=u[i];c[4]&&(n[c[1]]=n[c[1]].toLowerCase())}return n.origin=n.protocol&&n.host&&"file:"!==n.protocol?n.protocol+"//"+n.host:"null",n.href=n.toString(),n},toString:function(t){t&&"function"==typeof t||(t=a.stringify);var e,r=this,o=r.protocol;o&&":"!==o.charAt(o.length-1)&&(o+=":");var s=o+(r.slashes?"//":"");return r.username&&(s+=r.username,r.password&&(s+=":"+r.password),s+="@"),s+=r.host+r.pathname,(e="object"===n(r.query)?t(r.query):r.query)&&(s+="?"!==e.charAt(0)?"?"+e:e),r.hash&&(s+=r.hash),s}},p.extractProtocol=f,p.location=l,p.qs=a,t.exports=p}).call(e,r(14))},function(t,e,r){"use strict";var n,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"===("undefined"==typeof window?"undefined":o(window))&&(n=window)}t.exports=n},function(t,e,r){"use strict";t.exports=function(t,e){if(e=e.split(":")[0],!(t=+t))return!1;switch(e){case"http":case"ws":return 80!==t;case"https":case"wss":return 443!==t;case"ftp":return 21!==t;case"gopher":return 70!==t;case"file":return!1}return 0!==t}},function(t,e,r){"use strict";var n=Object.prototype.hasOwnProperty;function o(t){return decodeURIComponent(t.replace(/\+/g," "))}e.stringify=function(t,e){e=e||"";var r=[];for(var o in"string"!=typeof e&&(e="?"),t)n.call(t,o)&&r.push(encodeURIComponent(o)+"="+encodeURIComponent(t[o]));return r.length?e+r.join("&"):""},e.parse=function(t){for(var e,r=/([^=?&]+)=?([^&]*)/g,n={};e=r.exec(t);n[o(e[1])]=o(e[2]));return n}},function(t,e,r){"use strict";t.exports=function(t,e){var r=[];return function t(e,r,n){Array.isArray(r)?r.forEach(function(r){t(e,r,n)}):r.tagName!==e?r.children&&r.children.forEach(function(r){t(e,r,n)}):n.push(r)}(t,e,r),r}}]);