const fs = require('fs-extra');
const execSync = require('child_process').execSync;

module.exports = function cleanTestRepos(tmpLocalRepo, remoteRepoPath) {
  fs.removeSync(tmpLocalRepo);
  fs.removeSync(remoteRepoPath);
  execSync(`git init --bare ${remoteRepoPath}`);
};
