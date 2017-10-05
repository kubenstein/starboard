const path = require('path');
const cleanTestRepos = require('./specs/support/clean-test-repos.js');
const lib = require('../../../.tmp/specs/src/starboard.js');

const pathToGitTempLocalRepo = path.join(__dirname, '../../../.tmp/specs/uploads/');
const pathToGitRemoteRepo = path.join(pathToGitTempLocalRepo, '../fakeRemoteRepo');

cleanTestRepos(pathToGitTempLocalRepo, pathToGitRemoteRepo);

const gitContainer = new lib.GitContainer({
  pathToTempLocalRepo: pathToGitTempLocalRepo,
  remoteRepoUrl: pathToGitRemoteRepo,
});

const eventStorage = new lib.GitEventStorage({
  gitContainer: gitContainer,
  syncingInterval: 10000,
});

const gitFilesStorage = new lib.GitFilesStorage({
  gitContainer: gitContainer,
});

exports.server = new lib.Starboard({
  port: 19423,
  filesStorage: gitFilesStorage,
  eventStorage: eventStorage,
  noBanner: true,
});

exports.currentState = new lib.CurrentState({
  eventStorage: eventStorage,
});
