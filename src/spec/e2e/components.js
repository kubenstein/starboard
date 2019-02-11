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

const eventStorage = new lib.GitEventStorage({
  gitContainer,
  syncingInterval: 10000,
});

const gitFilesStorage = new lib.GitFilesStorage({
  gitContainer,
});

const state = new lib.State({
  eventStorage,
});

exports.server = new lib.Starboard({
  port: 19423,
  filesStorage: gitFilesStorage,
  eventStorage,
  state,
  noBanner: true,
});

exports.state = state;
