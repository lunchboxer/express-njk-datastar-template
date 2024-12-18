# Express NJK Datastar template

This is a template for an [Express](http://expressjs.com/) app using [nunjucks](https://mozilla.github.io/nunjucks/) as the templating engine. For reactivity and interactivity with the server, the front-end uses [datastar](https://data-star.dev/). This is a similar approach to using HTMX and Alpine.js, but simpler.

It requires Node.js 18.x or later.

## Other features

- CSS only theme switcher
- live reload
- CSS mostly based on [milligram](https://milligram.io/)
- biome for linting and formatting

## Quirks

- tooling for datastar is not great. The javascript is in a string so the normal javascript lsp ignores it.

- live reload does not reload the css when app.css is changed.
