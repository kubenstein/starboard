import mkdirp from 'mkdirp';
import { exec } from 'child_process';

const swallowErrors = () => {};

export default class GitCommands {
  constructor(params) {
    this.pathToTempLocalRepo = params.pathToTempLocalRepo;
    this.commiterUsername = params.commiterUsername;
    this.commiterEmail = params.commiterEmail;
    this.dataBranchName = params.dataBranchName;
    this.remoteRepoUrl = params.remoteRepoUrl;
    this.pathToSshPrivateKey = params.pathToSshPrivateKey;
    this.logger = params.logger;

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

  gitAddFile(filePath) {
    return this.execute(`git -C ${this.pathToTempLocalRepo} add "${filePath}"`);
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
    const escapedMessage = message.replace(/'/g, '\'"\'"\''); // replace ' -> '"'"'
    return this.execute(`git -C ${this.pathToTempLocalRepo} commit --allow-empty -m '${escapedMessage}'`);
  }

  // private

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
