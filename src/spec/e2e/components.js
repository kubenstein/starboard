const path = require('path');
const cleanTestRepos = require('./specs/support/clean-test-repos.js');
const lib = require('../../../.tmp/specs/src/starboard.js');

const pathToGitTempLocalRepo = path.join(__dirname, '../../../.tmp/specs/uploads/');
const pathToGitRemoteRepo = path.join(pathToGitTempLocalRepo, '../fakeRemoteRepo');

cleanTestRepos(pathToGitTempLocalRepo, pathToGitRemoteRepo);

const storage = new lib.GitEventStorage({
  remoteRepoUrl: pathToGitRemoteRepo,
  pathToTempLocalRepo: pathToGitTempLocalRepo,
  syncingInterval: 10000
});

exports.server = new lib.Starboard({
  port: 19423,
  eventStorage: storage,
  uploadsDir: pathToGitTempLocalRepo,
  noBanner: true
});

exports.currentState = new lib.CurrentState({ eventSource: storage });
