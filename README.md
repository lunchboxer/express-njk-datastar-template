# Express NJK Datastar template

This is a template for an [Express](http://expressjs.com/) app using [nunjucks](https://mozilla.github.io/nunjucks/) as the templating engine. For reactivity and interactivity with the server, the front-end uses [datastar](https://data-star.dev/). This is a similar approach to using HTMX and Alpine.js, but simpler.

It requires Node.js 18.x or later.

## Other features

- CSS only theme switcher
- live reload
- CSS mostly based on [milligram](https://milligram.io/)
- biome for linting and formatting
- [feather icons](https://feathericons.com/), so far just for theme switcher

## Quirks

- tooling for datastar is not great. The javascript is in a string so the normal javascript lsp ignores it.

## Getting started

You'll need to have [atlas](https://atlasgo.io) installed for the database migrations. `curl -sSf https://atlasgo.sh | sh` should do the trick. With atlas installed run `./database/migrate-local.sh` to create the local sqlite database and set it up according to `./database/schema.sql`.

Install dependencies with `npm install`.

Run the server with `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.
