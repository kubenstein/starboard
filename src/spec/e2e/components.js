/* eslint-disable import/no-unresolved */
const path = require('path');
const cleanTestRepos = require('./specs/support/clean-test-repos.js');
const lib = require('../../../dist/starboard.js');

const pathToGitTempLocalRepo = path.join(__dirname, '../../../.tmp/specs/uploads/');
const pathToGitRemoteRepo = path.join(pathToGitTempLocalRepo, '../fakeRemoteRepo');

cleanTestRepos(pathToGitTempLocalRepo, pathToGitRemoteRepo);


const gitContainer = new lib.GitContainer({
  pathToTempLocalRepo: pathToGitTempLocalRepo,
  remoteRepoUrl: pathToGitRemoteRepo,
});

const strategy = new lib.GitStrategy({
  gitContainer,
  syncingInterval: 10000,
});

exports.state = new lib.State({
  eventStorage: strategy.eventStorage,
});

exports.server = new lib.Starboard({
  port: 19423,
  strategy,
  publicFilesDir: pathToGitTempLocalRepo,
  noBanner: true,
});
