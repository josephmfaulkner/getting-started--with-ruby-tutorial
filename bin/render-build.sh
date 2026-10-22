#!/usr/bin/env bash
# Build script run by Render on every deploy (see render.yaml)
set -o errexit

bundle install
bin/rails assets:precompile
bin/rails assets:clean

# The free plan has no pre-deploy command, so migrate during the build
bin/rails db:migrate
