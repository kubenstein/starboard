const exec = require('child_process').exec;
const path = process.env.PATH_TO_REPO || './db/development/';
exec(`git init --bare ${path}`);