const exec = require('child_process').exec;
const path = process.env.PATH_TO_REPO || `${__dirname}/../db/development/`;
const mkdirp = require('mkdirp');

mkdirp.sync(path);

exec(`git init --bare ${path}`);