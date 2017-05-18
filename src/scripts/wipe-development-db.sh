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
  rm -rf .tmp/tmpRepo/
}

function wipeRemoteDevelopmentDb() {
  rm -rf .tmp/fakeDevelopmentRemoteGitRepo/
}

function recreateRemoteDevelopmentDb() {
  npm run dev:db:create
}


# go!
main