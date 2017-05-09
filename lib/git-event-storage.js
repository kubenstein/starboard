import { exec } from 'child_process';
import { noopEvent } from './event-definitions.js';

const swallowErrors = () => {};

export default class GitEventStorage {
  constructor(params) {
    this.pathToRepo = params.pathToRepo;
    this.dataBranchName = params.dataBranchName || '__starboard-data';
    this.tempLocation = params.tempLocation || '.tmp/';
    this.pollingIntervalInSeconds = params.pollingIntervalInSeconds || 30;
    this.logger = params.logger || { log: () => {} };
    this.observers = [];

    this.queue = Promise.resolve()
                 .then(this.gitSetupLocalRepo.bind(this))
                 .then(this.gatherNewEvents.bind(this));

    this.pollingLoopTimer = this.startPollingLoop(this.pollingIntervalInSeconds);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(() => { return this.gitCommitAndPush(JSON.stringify(event)); })
      .then(() => { return this.notify(event); })
      .then(() => { resolve(); });
    });
  }

  getAllPastEvents() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue
      .then(this.gitGetAllCommitMessages.bind(this))
      .then(this.extractEventsFromCommits.bind(this))
      .then(resolve);
    });
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }

  gatherNewEvents() {
    return this.gitFetchChanges()
    .then(() => {
      return this.gitCalculateDiffCommitMessages()
      .then(this.extractEventsFromCommits.bind(this))
      .then((events) => { events.forEach((event) => { this.notify(event); }); })
      .then(this.gitPullChanges.bind(this));
    })
    .catch(swallowErrors);
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

  startPollingLoop(pollingIntervalInSeconds) {
    if (pollingIntervalInSeconds <= 0) {
      return null;
    }

    return setInterval(() => {
      this.queue = this.queue
      .then(this.gatherNewEvents.bind(this));
    }, pollingIntervalInSeconds * 1000);
  }

  // git commands

  gitSetupLocalRepo() {
    return this.gitInitRepo()
    .then(this.gitAddRemote.bind(this))
    .then(this.gitCheckoutDataBranch.bind(this))
    .then(this.gitFetchChangesWithEmptyRepoFallback.bind(this));
  }

  gitInitRepo() {
    return this.execute(`git init ${this.tempLocation}`);
  }

  gitCheckoutDataBranch() {
    return this.execute(`git -C ${this.tempLocation} checkout -b ${this.dataBranchName}`)
    .catch(swallowErrors);
  }

  gitAddRemote() {
    return this.execute(`git -C ${this.tempLocation} remote add origin ${this.pathToRepo}`)
    .catch(swallowErrors);
  }

  gitFetchChanges() {
    return this.execute(`git -C ${this.tempLocation} fetch origin ${this.dataBranchName}`);
  }

  gitFetchChangesWithEmptyRepoFallback() {
    return this.gitFetchChanges()
    .catch(() => {
      return this.gitPushEmptySetupCommit();
    });
  }

  gitCalculateDiffCommitMessages() {
    return this.execute(`git -C ${this.tempLocation} log --oneline \
                         ${this.dataBranchName}...origin/${this.dataBranchName}`)
    //
    // when there is nothing in local branch
    // we ask for everything
    .catch(this.gitGetAllCommitMessages.bind(this));
  }

  gitGetAllCommitMessages() {
    return this.execute(`git -C ${this.tempLocation} log --oneline origin/${this.dataBranchName}`);
  }

  gitPullChanges() {
    return this.execute(`git -C ${this.tempLocation} pull --rebase origin ${this.dataBranchName}`);
  }

  gitPushChanges() {
    return this.execute(`git -C ${this.tempLocation} push origin ${this.dataBranchName}`);
  }

  gitPushEmptySetupCommit() {
    return this.gitCommitAndPush(JSON.stringify(noopEvent()));
  }

  gitCommitAndPush(message) {
    const escapedMessage = message.replace(/"/g, '\\"');

    return this.execute(`git -C ${this.tempLocation} commit --allow-empty -m "${escapedMessage}"`)
    .then(this.gitPullChanges.bind(this))
    .catch(swallowErrors)
    .then(this.gitPushChanges.bind(this));
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, _stderr) => {
        this.logger.log(command);
        if (error) {
          return reject(error);
        }
        return resolve(stdout);
      });
    });
  }
}
