import {
  noopEvent,
  fileRemovedEvent,
} from 'lib/event-definitions';
import NullLogger from 'lib/null-logger';
import { hasToBeSet } from 'lib/utils';

export default class GitEventStorage {
  constructor(params) {
    this.syncingInterval = params.syncingInterval || 30;
    this.git = params.gitContainer || hasToBeSet('gitContainer');
    this.logger = params.logger || new NullLogger();

    this.observers = [];
    this.lastSyncedCommit = undefined;
    this.eventIdsSinceLastSync = [];
    this.queue = Promise.resolve();

    this.start();
  }

  welcomeInfo() {
    return `Source GIT repo set to: ${this.git.remoteRepoUrl}`;
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

  removeFile(fileNameInGitFolder) {
    return new Promise((resolve, _reject) => {
      const event = fileRemovedEvent(this.commiterEmail, fileNameInGitFolder);
      this.queue = this.queue
      .then(() => { return this.git.removeFile(fileNameInGitFolder); })
      .then(() => { return this.applyEvent(event); })
      .then(() => { resolve(fileNameInGitFolder); });
    });
  }

  allPastEvents() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.git.getAllCommitMessages(); })
      .then((commitMessagesText) => { return this.extractEventsFromCommits(commitMessagesText); })
      .then(resolve);
    });
  }

  sync() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.git.pushChangesWithEventualRebase(); })  // Push With Eventual Rebase will
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
    return this.git.initRepo()
    .then(() => { return this.git.addUser(); })
    .then(() => { return this.git.addRemote(); })
    .then(() => { return this.setupLocalAndRemoteBranch(); });
  }

  setupLocalAndRemoteBranch() {
    return this.git.createDataBranch()
    .then(() => { return this.git.pullChanges(); })
    .catch(() => { return this.pushEmptySetupCommit(); });
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }

  applyEvent(event) {
    return this.git.commit(JSON.stringify(event))
    .then(() => { this.eventIdsSinceLastSync.push(event.id); })
    .then(() => { return this.notify(event); });
  }

  gatherUnsyncedEvents() {
    return this.git.calculateDiffCommitMessages(this.lastSyncedCommit)
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
    return this.git.commitHash()
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
    return this.git.commit(JSON.stringify(event))
    .then(() => { return this.git.pushChangesWithEventualRebase(); });
  }
}
