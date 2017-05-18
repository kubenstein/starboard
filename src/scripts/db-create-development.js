//
// run from root project folder
//

const exec = require('child_process').exec;
const path = process.env.PATH_TO_REPO || `.tmp/fakeDevelopmentRemoteGitRepo/`;
const mkdirp = require('mkdirp');

mkdirp.sync(path);

exec(`git init --bare ${path}`);