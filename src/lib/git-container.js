import mkdirp from 'mkdirp';
import { exec } from 'child_process';
import { hasToBeSet } from 'lib/utils';
import NullLogger from 'lib/null-logger';

const swallowErrors = () => {};

export default class GitContainer {
  constructor(params) {
    this.pathToTempLocalRepo = params.pathToTempLocalRepo || '.tmp/tmpRepo/'; // path HAS to end with /;
    this.commiterUsername = params.commiterUsername || 'Starboard BOT';
    this.commiterEmail = params.commiterEmail || 'starboardbot@localhost';
    this.dataBranchName = params.dataBranchName || '__starboard-data';
    this.remoteRepoUrl = params.remoteRepoUrl || hasToBeSet('remoteRepoUrl');
    this.pathToSshPrivateKey = params.pathToSshPrivateKey;
    this.logger = params.logger || new NullLogger();

    mkdirp.sync(this.pathToTempLocalRepo);
    this.configureGitPrivateKeyIfNeeded();
  }

  gitInitRepo() {
    return this.execute(`git init ${this.pathToTempLocalRepo}`);
  }

  gitAddUser() {
    return Promise.resolve()
    .then(() => {
      return this.execute(`git -C ${this.pathToTempLocalRepo} config user.name "${this.commiterUsername}"`);
    })
    .then(() => {
      return this.execute(`git -C ${this.pathToTempLocalRepo} config user.email "${this.commiterEmail}"`);
    });
  }

  gitCreateDataBranch() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} checkout -b ${this.dataBranchName}`)
    .catch(swallowErrors);
  }

  gitAddRemote() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} remote add origin ${this.remoteRepoUrl}`)
    .catch(swallowErrors);
  }

  gitCommitHash() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} rev-parse ${this.dataBranchName}`);
  }

  gitCalculateDiffCommitMessages(lastSyncedCommit) {
    if (lastSyncedCommit) {
      return this.execute(`git -C ${this.pathToTempLocalRepo} log --oneline \
                           ${lastSyncedCommit}...${this.dataBranchName}`);
    }
    return this.gitGetAllCommitMessages();
  }

  gitGetAllCommitMessages() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} log --oneline ${this.dataBranchName}`);
  }

  gitPullChanges() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} pull --rebase origin ${this.dataBranchName}`);
  }

  gitPushChanges() {
    return this.execute(`git -C ${this.pathToTempLocalRepo} push origin ${this.dataBranchName}`);
  }

  gitAddFile(fileNameInGitFolder, commitMessage) {
    return this.execute(`
      git -C ${this.pathToTempLocalRepo} add "${fileNameInGitFolder}" ;
      ${this.gitCommitShellCommand(commitMessage)}
    `);
  }

  gitRemoveFile(filePath) {
    return this.execute(`git -C ${this.pathToTempLocalRepo} rm "${filePath}"`);
  }

  gitPushChangesWithEventualRebase() {
    //
    // try to push till it success,
    // on fail: pull changes and try again
    return this.gitPushChanges()
    .catch(() => {
      return this.gitPullChanges()
      .then(this.gitPushChangesWithEventualRebase.bind(this));
    });
  }

  gitCommit(message) {
    return this.execute(this.gitCommitShellCommand(message));
  }

  // private

  gitCommitShellCommand(message) {
    const escapedMessage = message.replace(/'/g, '\'"\'"\''); // replace ' -> '"'"'
    return `git -C ${this.pathToTempLocalRepo} commit --allow-empty -m '${escapedMessage}'`;
  }

  configureGitPrivateKeyIfNeeded() {
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
