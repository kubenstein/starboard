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
  rm -rf ./src/db/
}

function recreateRemoteDevelopmentDb() {
  npm run dev:db:create
}


# go!
main