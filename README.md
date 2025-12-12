## cleanview

Clean the content of html articles, same job as services like Instapaper/Readability.

It doesn't use DOM or Virtual DOM in the process.

### Usage:

```javascript
import cleanview from "cleanview";

const optionalParameters = {
  url: "https://example.com/my-article",
};

const output = cleanview(ARTICLE_HTML, optionalParameters);
```

### Optional Parameters:

- `url`: Here, you can pass the url of the article you're parsing, this is used to convert relative urls to absolute. So, if the link you're passing is `https://example.com/my-article` a relative article in the page pointing to `/another-article` will become `https://example.com/another-article`.

- `minRatio`: (default value is 0.75) a number between 0 and 1 which determinate the ratio of `<p>` tags a container should have to be considered the "main" article body, this ratio is compared against all the `<p>` tags inside the page, that means, if the container have at least 75% of all the `<p>` tags in the page, this will be the main container, if not, his parent container will be checked for if it fulfills the desired ratio.

- `includeTags`: Tags to include in the content search, you can check the default tag list on [`src/defaults/valid-tags.ts`][valid].

- `forbiddenClasses`: Classes to exclude from the conent search, you can check the default class list on [`src/defaults/forbidden-classes.ts`][forbidden].

[valid]: https://github.com/HersonHN/cleanview/blob/master/src/defaults/valid-tags.ts
[forbidden]: https://github.com/HersonHN/cleanview/blob/master/src/defaults/forbidden-classes.ts
