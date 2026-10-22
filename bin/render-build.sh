#!/usr/bin/env bash
# Build script run by Render on every deploy (see render.yaml)
set -o errexit

bundle install

# Build the React app (react/src): "build" in package.json runs ./bin/shakapacker
npm ci
npm run build

# Stylesheets and other assets (the React app was already built above)
SHAKAPACKER_PRECOMPILE=false bin/rails assets:precompile
bin/rails assets:clean

# The free plan has no pre-deploy command, so migrate during the build
bin/rails db:migrate
