import GitCommands from './git-commands.js';
import {
  noopEvent,
  fileAddedEvent,
  fileRemovedEvent
} from '../event-definitions.js';

export default class GitEventStorage {
  constructor(params) {
    this.syncingInterval = params.syncingInterval || 30;
    this.git = new GitCommands({
      pathToTempLocalRepo: params.pathToTempLocalRepo || '.tmp/tmpRepo/', // path HAS to end with /
      commiterUsername: params.commiterUsername || 'Starboard BOT',
      commiterEmail: params.commiterEmail || 'starboardbot@localhost',
      dataBranchName: params.dataBranchName || '__starboard-data',
      remoteRepoUrl: params.remoteRepoUrl,
      pathToSshPrivateKey: params.pathToSshPrivateKey,
      logger: params.logger || { log: () => {} }
    });

    this.observers = [];
    this.lastSyncedCommit = undefined;
    this.eventIdsSinceLastSync = [];
    this.queue = Promise.resolve();

    this.start();
  }

  welcomeInfo() {
    return `Source repo set to: ${this.remoteRepoUrl}`;
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

  addFile(fileNameInGitFolder) {
    return new Promise((resolve, _reject) => {
      const event = fileAddedEvent(this.commiterEmail, fileNameInGitFolder);
      this.queue = this.queue
      .then(() => { return this.git.gitAddFile(fileNameInGitFolder); })
      .then(() => { return this.applyEvent(event); })
      .then(() => { resolve(fileNameInGitFolder); });
    });
  }

  removeFile(fileNameInGitFolder) {
    return new Promise((resolve, _reject) => {
      const event = fileRemovedEvent(this.commiterEmail, fileNameInGitFolder);
      this.queue = this.queue
      .then(() => { return this.git.gitRemoveFile(fileNameInGitFolder); })
      .then(() => { return this.applyEvent(event); })
      .then(() => { resolve(fileNameInGitFolder); });
    });
  }

  allPastEvents() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.git.gitGetAllCommitMessages(); })
      .then((commitMessagesText) => { return this.extractEventsFromCommits(commitMessagesText); })
      .then(resolve);
    });
  }

  sync() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.git.gitPushChangesWithEventualRebase(); })  // Push With Eventual Rebase will
                                                                            // fetch data also whenever clear push
                                                                            // is rejected.
                                                                            // After rebase some old events
                                                                            // will reappear again, however those events
                                                                            // wont be applied again because of
                                                                            // eventIdsSinceLastSync guarding mechanism
                                                                            // It handles both scenarios where there
                                                                            // is something new on remote or on local.
      .then(() => { return this.gatherUnsyncedEvents(); })
      .then(() => { return this.updateLastSyncedCommit(); })
      .then(resolve);
    });
  }

  // private

  start() {
    this.queue = this.queue
    .then(() => { return this.setupLocalRepo(); });

    this.syncingLoopTimer = this.startPollingLoop(this.syncingInterval);
  }

  setupLocalRepo() {
    return this.git.gitInitRepo()
    .then(() => { return this.git.gitAddUser(); })
    .then(() => { return this.git.gitAddRemote(); })
    .then(() => { return this.setupLocalAndRemoteBranch(); });
  }

  setupLocalAndRemoteBranch() {
    return this.git.gitCreateDataBranch()
    .then(() => { return this.git.gitPullChanges(); })
    .catch(() => { return this.pushEmptySetupCommit(); });
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }

  applyEvent(event) {
    return this.git.gitCommit(JSON.stringify(event))
    .then(() => { this.eventIdsSinceLastSync.push(event.id); })
    .then(() => { return this.notify(event); });
  }

  gatherUnsyncedEvents() {
    return this.git.gitCalculateDiffCommitMessages(this.lastSyncedCommit)
    .then((commitMessagesText) => { return this.extractEventsFromCommits(commitMessagesText); })
    .then((events) => {
      events
      .filter((event) => { return this.eventIdsSinceLastSync.indexOf(event.id) === -1; })
      .forEach((event) => { this.notify(event); });
    });
  }

  extractEventsFromCommits(textWithCommits) {
    const messages = textWithCommits
                     .split('\n')       // separate commits
                     .filter(e => e)    // remove empty strings
                     .reverse();        // change order to earliest first

    const events = messages.map((message) => {
      const extractedJson = message.split(' ').slice(1).join(' '); // remove commit hash from message
      const event = JSON.parse(extractedJson);
      return event;
    });
    return events;
  }

  updateLastSyncedCommit() {
    this.eventIdsSinceLastSync = [];
    return this.git.gitCommitHash()
    .then((hash) => { this.lastSyncedCommit = hash; });
  }

  startPollingLoop(syncingInterval) {
    if (syncingInterval <= 0) return null;
    this.sync();
    return setInterval(() => {
      this.sync();
    }, syncingInterval * 1000);
  }

  pushEmptySetupCommit() {
    const event = noopEvent();
    return this.git.gitCommit(JSON.stringify(event))
    .then(() => { return this.git.gitPushChangesWithEventualRebase(); });
  }
}
