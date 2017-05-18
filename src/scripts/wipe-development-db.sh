#!/bin/bash
#
# Run from root project folder
#

function main() {
  wipeLocalDevelopmentDb
  wipeRemoteDevelopmentDb
  recreateRemoteDevelopmentDb
}


# private

function wipeLocalDevelopmentDb() {
  rm -rf .tmp/
}

function wipeRemoteDevelopmentDb() {
  find ./db/development ! -name '.gitkeep' -type f -exec rm -f {} +
}

function recreateRemoteDevelopmentDb() {
  npm run dev:db:create
}


# go!
main