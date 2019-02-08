import path from 'path';
import mkdirp from 'mkdirp';
import { exec } from 'child_process';
import { hasToBeSet } from 'lib/utils';
import NullLogger from 'lib/null-logger';

const swallowErrors = () => {};

export default class GitContainer {
  constructor(params) {
    this.pathToTempLocalRepo = path.resolve(params.pathToTempLocalRepo) || path.resolve('.tmp/tmpRepo/');
    this.commiterUsername = params.commiterUsername || 'Starboard BOT';
    this.commiterEmail = params.commiterEmail || 'starboardbot@localhost';
    this.dataBranchName = params.dataBranchName || '__starboard-data';
    this.remoteRepoUrl = params.remoteRepoUrl || hasToBeSet('remoteRepoUrl');
    this.pathToSshPrivateKey = params.pathToSshPrivateKey && path.resolve(params.pathToSshPrivateKey);
    this.logger = params.logger || new NullLogger();

    mkdirp.sync(this.pathToTempLocalRepo);
    this.configurePrivateKeyIfNeeded();
  }

  initRepo() {
    return this.execute(`git init ${this.pathToTempLocalRepo}`);
  }

  addUser() {
    return Promise.resolve()
      .then(() => this.execute(`git -C ${this.pathToTempLocalRepo} config user.name "${this.commiterUsername}"`))
      .then(() => this.execute(`git -C ${this.pathToTempLocalRepo} config user.email "${this.commiterEmail}"`));
  }

  createDataBranch() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} checkout -b ${this.dataBranchName}`)
      .catch(swallowErrors);
  }

  addRemote() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} remote add origin ${this.remoteRepoUrl}`)
      .catch(swallowErrors);
  }

  commitHash() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} rev-parse ${this.dataBranchName}`);
  }

  calculateDiffCommitMessages(lastSyncedCommit) {
    if (lastSyncedCommit) {
      return this.execute(`git -C ${this.pathToTempLocalRepo} log --oneline \
                           ${lastSyncedCommit}...${this.dataBranchName}`);
    }
    return this.getAllCommitMessages();
  }

  getAllCommitMessages() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} log --oneline ${this.dataBranchName}`);
  }

  pullChanges() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} pull --rebase origin ${this.dataBranchName}`);
  }

  pushChanges() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} push origin ${this.dataBranchName}`);
  }

  addFile(fileNameInGitFolder, commitMessage) {
    return this.execute(`
      git -C ${this.pathToTempLocalRepo} add "${fileNameInGitFolder}" ;
      ${this.commitShellCommand(commitMessage)}
    `);
  }

  removeFile(filePath) {
    return this.execute(`git -C ${this.pathToTempLocalRepo} rm "${filePath}"`);
  }

  pushChangesWithEventualRebase() {
    //
    // try to push till it success,
    // on fail: pull changes and try again
    return this.pushChanges()
      .catch(() => this.pullChanges()
        .then(this.gitPushChangesWithEventualRebase.bind(this)),
      );
  }

  commit(message) {
    return this.execute(this.commitShellCommand(message));
  }

  // private

  commitShellCommand(message) {
    const escapedMessage = message.replace(/'/g, '\'"\'"\''); // replace ' -> '"'"'
    return `git -C ${this.pathToTempLocalRepo} commit --allow-empty -m '${escapedMessage}'`;
  }

  configurePrivateKeyIfNeeded() {
    if (!this.pathToSshPrivateKey) return;
    //
    // taken from:
    // https://superuser.com/a/912281
    process.env.GIT_SSH_COMMAND = `ssh -i ${this.pathToSshPrivateKey} -F /dev/null`;
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      exec(command, { env: process.env }, (error, stdout, _stderr) => {
        this.logger.log(command);
        if (error) {
          return reject(error);
        }
        return resolve(stdout.trim());
      });
    });
  }
}
