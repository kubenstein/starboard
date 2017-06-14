const fs = require('fs-extra');
const execSync = require('child_process').execSync;

module.exports = function cleanFakeRemoteRepo(tmpLocalRepo, fakeRemoteRepoPath) {
  fs.removeSync(tmpLocalRepo);
  fs.removeSync(fakeRemoteRepoPath);
  execSync(`git init --bare ${fakeRemoteRepoPath}`);
};
