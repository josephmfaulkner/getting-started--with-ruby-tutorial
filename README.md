# Getting Started with Rails: Store

The e-commerce store from the Rails tutorials (Getting Started, Sign Up and
Settings, Wishlists, Product Reviews), with the frontend rebuilt as a React
single-page app.

- **Rails** serves a JSON API under `/api` (`app/controllers/api`, `app/views/api`)
  and one HTML page for every other URL (`SpaController`).
- **React + TypeScript** source is in `react/src`, built by
  [Shakapacker](https://github.com/shakacode/shakapacker) (Rspack + SWC).
  The UI uses [Material UI](https://mui.com/material-ui/); the theme (colors,
  shapes, typography) is in `react/src/theme.ts`.

## Requirements

- Ruby 3.4.11 (see `.ruby-version`)
- Node.js 22 (see `.node-version`)
- [libvips](https://www.libvips.org/) for image thumbnails (`sudo apt install libvips42`)
- Google Chrome, only for the browser (system) tests

## Setup

The first time, or after pulling changes:

```bash
bin/setup --skip-server   # bundle install, npm install, prepare the database
```

## Running locally

```bash
bin/dev                   # same as bin/rails server
```

Open http://localhost:3000. In development the JavaScript is built
automatically when a page loads and something in `react/src` has changed, so
after editing you just refresh the browser.

To make page loads faster while editing a lot, keep a watcher running in a
second terminal. It rebuilds whenever you save:

```bash
npm run watch             # ./bin/shakapacker --watch
```

### Admin access

The Store Settings admin pages need an admin account. Sign up through the site,
then:

```bash
bin/rails runner 'User.where(email_address: "you@example.org").update_all(admin: true)'
```

`admin` is read-only in the `User` model, so it can't be changed with `update`
and has to be set this way (or with SQL).

## Building

```bash
npm run build                            # development build: ./bin/shakapacker
RAILS_ENV=production npm run build       # production build: minified, fingerprinted, compressed
```

Output goes to `public/packs/`, which is ignored by git.

## Tests

```bash
bin/rails test            # Rails and API tests
bin/rails test:system     # browser tests (headless Chrome)
npm test                  # React tests (Vitest)
npm run typecheck         # TypeScript
```

`bin/ci` runs the linters, security audits, and tests together.

## Deploying to Render

`render.yaml` defines the web service and a Postgres database. Each deploy runs
`bin/render-build.sh`, which installs gems and npm packages, runs
`npm run build`, precompiles assets, and migrates the database, so there's
nothing to build by hand. Set `RAILS_MASTER_KEY` (the contents of
`config/master.key`) on the service.

On the free plan, uploaded images are lost when the service restarts or
redeploys, and no mail server is configured, so emails (password reset, back
in stock) aren't delivered.
