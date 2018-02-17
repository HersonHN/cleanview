
cleanview
---------

Clean the content of html articles, same job as services like Instapaper/Readability.

It doesn't use DOM or Virtual DOM in the process.


### Usage:

``` javascript
var cleanview = require('cleanview');
var output = cleanview(ARTICLE_HTML, { url: ARTICLE_URL }); // url is optional
```
