import mkdirp from 'mkdirp';
import { exec } from 'child_process';
import {
  noopEvent,
  fileAddedEvent,
  fileRemovedEvent
} from './event-definitions.js';

const swallowErrors = () => {};

export default class GitEventStorage {
  constructor(params) {
    this.remoteRepoUrl = params.remoteRepoUrl;
    this.pathToSshPrivateKey = params.pathToSshPrivateKey;
    this.commiterUsername = params.commiterUsername || 'Starboard BOT';
    this.commiterEmail = params.commiterEmail || 'starboardbot@localhost';
    this.dataBranchName = params.dataBranchName || '__starboard-data';
    this.pathToTempLocalRepo = params.pathToTempLocalRepo || '.tmp/tmpRepo/'; // path HAS to end with /
    this.syncingIntervalInSeconds = params.syncingIntervalInSeconds || 30;
    this.logger = params.logger || { log: () => {} };
    this.observers = [];
    this.lastSyncedCommit = undefined;
    this.queue = Promise.resolve();

    mkdirp.sync(this.pathToTempLocalRepo);
    this.start();
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.applyEvent(event); })
      .then(resolve);
    });
  }

  addFile(filePath) {
    return new Promise((resolve, _reject) => {
      const event = fileAddedEvent(filePath);
      this.queue = this.queue
      .then(() => { return this.gitAddFile(filePath); })
      .then(() => { return this.applyEvent(event); })
      .then(() => { resolve(filePath); });
    });
  }

  removeFile(filePath) {
    return new Promise((resolve, _reject) => {
      const event = fileRemovedEvent(filePath);
      this.queue = this.queue
      .then(() => { return this.gitRemoveFile(filePath); })
      .then(() => { return this.applyEvent(event); })
      .then(() => { resolve(filePath); });
    });
  }

  allPastEvents() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(this.gitGetAllCommitMessages.bind(this))
      .then(this.extractEventsFromCommits.bind(this))
      .then(resolve);
    });
  }

  // private

  configureGitPrivateKeyIfNeeded() {
    if (!this.pathToSshPrivateKey) return;
    //
    // taken from:
    // https://superuser.com/a/912281
    process.env.GIT_SSH_COMMAND = `ssh -i ${this.pathToSshPrivateKey} -F /dev/null`;
  }

  start() {
    this.configureGitPrivateKeyIfNeeded();

    this.queue = this.queue
    .then(this.setupLocalRepo.bind(this));

    this.syncingLoopTimer = this.startPollingLoop(this.syncingIntervalInSeconds);
  }

  setupLocalRepo() {
    return this.gitInitRepo()
    .then(this.gitAddUser.bind(this))
    .then(this.gitAddRemote.bind(this))
    .then(this.setupLocalAndRemoteBranch.bind(this));
  }

  setupLocalAndRemoteBranch() {
    return this.gitCreateDataBranch()
    .then(this.gitPullChanges.bind(this))
    .catch(this.gitPushEmptySetupCommit.bind(this));
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }

  sync() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(this.gitPushChangesWithEventualRebase.bind(this)) // Push With Eventual Rebase will
                                                              // fetch data if needed.
                                                              // After rebase some old events
                                                              // will be applied again. Possible
                                                              // new data overwrite!!!
                                                              // If it wont fetch it means nothing
                                                              // new were in the remote.
      .then(this.gatherUnsyncedEvents.bind(this))
      .then(this.updateLastSyncedCommit.bind(this))
      .then(resolve);
    });
  }

  applyEvent(event) {
    return this.gitCommit(JSON.stringify(event))
    .then(() => { return this.notify(event); });
  }

  gatherUnsyncedEvents() {
    return this.gitCalculateDiffCommitMessages()
    .then(this.extractEventsFromCommits.bind(this))
    .then((events) => { events.forEach((event) => { this.notify(event); }); });
  }

  extractEventsFromCommits(textWithCommits) {
    const messages = textWithCommits
                     .split('\n')       // separate commits
                     .filter(e => e)    // remove empty strings
                     .reverse();        // change order to earliest first

    const events = messages.map((message) => {
      const extractedJson = message.split(' ').slice(1).join(' ');
      const event = JSON.parse(extractedJson);
      return event;
    });
    return events;
  }

  updateLastSyncedCommit() {
    return this.gitCommitHash()
    .then((hash) => { this.lastSyncedCommit = hash; });
  }

  startPollingLoop(syncingIntervalInSeconds) {
    if (syncingIntervalInSeconds <= 0) return null;
    this.sync();
    return setInterval(() => {
      this.sync();
    }, syncingIntervalInSeconds * 1000);
  }

  // git commands

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

  gitCalculateDiffCommitMessages() {
    if (this.lastSyncedCommit) {
      return this.execute(`git -C ${this.pathToTempLocalRepo} log --oneline \
                           ${this.lastSyncedCommit}...${this.dataBranchName}`);
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

  gitPushEmptySetupCommit() {
    const event = noopEvent();
    return this.gitCommit(JSON.stringify(event))
    .then(this.gitPushChangesWithEventualRebase.bind(this));
  }

  gitPushChangesWithEventualRebase() {
    return this.gitPushChanges()
    .catch(() => {
      return this.gitPullChanges()
      .then(this.gitPushChanges.bind(this));
    });
  }

  gitCommit(message) {
    const escapedMessage = message.replace(/"/g, '\\"');
    return this.execute(`git -C ${this.pathToTempLocalRepo} commit --allow-empty -m "${escapedMessage}"`);
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
