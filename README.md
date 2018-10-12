
cleanview
---------

Clean the content of html articles, same job as services like Instapaper/Readability.

It doesn't use DOM or Virtual DOM in the process.


### Usage:

``` javascript
var cleanview = require('cleanview');
var output = cleanview(ARTICLE_HTML, { url: ARTICLE_URL }); // url is optional
```

### Optional Parameters:

- `minRatio`: (default value is 0.75) a number between 0 and 1 which determinate the ratio of `<p>` tags a container should have to be considered the "main" article body, this ratio is compared against all the `<p>` tags inside the page, that means, if the container have at least 75% of all the `<p>` tags in the page, this will be the main container, if not, his parent container will be checked for if it fulfills the desired ratio.

- `includeTags`: Tags to include in the content search, you can check the default tag list on [`defaults/valid-tags.js`](https://github.com/HersonHN/cleanview/blob/master/defaults/valid-tags.js).

- `forbiddenClasses`: Classes to exclude from the conent search, you can check the default class list on [`defaults/forbidden-classes.js`](https://github.com/HersonHN/cleanview/blob/master/defaults/forbidden-classes.js).




