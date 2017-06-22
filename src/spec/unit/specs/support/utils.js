const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const uuid = require('uuid/v4');

exports.generateTmpRepoPath = function () {
  return `/tmp/starboard-git-specs/${uuid()}`;
};

exports.generateRemoteRepoPath = function () {
  const p = `/tmp/starboard-git-specs/${uuid()}`;
  fs.ensureDirSync(p);
  execSync(`git init --bare ${p}`);
  return p;
};
