const exec = require('child_process').exec;

const swollowErrors = () => {};

class GitEventStorage {
  constructor(pathToRepo, dataBranchName = '__starboard-data', tempLocation = '.tmp/') {
    this.observers = [];
    this.pathToRepo = pathToRepo;
    this.dataBranchName = dataBranchName;
    this.tempLocation = tempLocation;

    this.queue = Promise.resolve()
                 .then(this.gitSetupLocalRepo.bind(this))
                 .then(this.gatherNewEvents.bind(this));

    this.pollingLoopTimer = this.startPollingLoop(30);
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
      .then(this.gitPullChanges.bind(this))
    })
    .catch(swollowErrors)
  }

  extractEventsFromCommits(textWithCommits) {
    const messages = textWithCommits
                     .split("\n")       // separate commits
                     .filter((e) => e)  // remove empty strings
                     .reverse();        // change order to earliest first

    const events = messages.map((message) => {
      const extractedJson = message.split(' ').slice(1).join(' ');
      const event = JSON.parse(extractedJson);
      return event;
    });
    return events;
  }

  startPollingLoop(pollingIntervalInSeconds) {
    return setInterval(() => {
      console.log('polling');
      this.queue = this.queue
      .then(this.gatherNewEvents.bind(this));
    }, pollingIntervalInSeconds * 1000);
  }

  // git commands

  gitSetupLocalRepo() {
    return this.gitInitRepo()
    .then(this.gitCheckoutDataBranch.bind(this))
    .then(this.gitAddRemote.bind(this))
  }

  gitInitRepo() {
    return this.execute(`git init ${this.tempLocation}`)
  }

  gitCheckoutDataBranch() {
    return this.execute(`git -C ${this.tempLocation} checkout -b ${this.dataBranchName}`)
    .catch(swollowErrors)
  }

  gitAddRemote() {
    return this.execute(`git -C ${this.tempLocation} remote add origin ${this.pathToRepo}`)
    .catch(swollowErrors)
  }

  gitFetchChanges() {
    return this.execute(`git -C ${this.tempLocation} fetch origin ${this.dataBranchName}`);
  }

  gitCalculateDiffCommitMessages() {
    return this.execute(`git -C ${this.tempLocation} log --oneline ${this.dataBranchName} origin/${this.dataBranchName}`)
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

  gitCommitAndPush(message) {
    const escapedMessage = message.replace(/"/g, '\\"');

    return this.execute(`git -C ${this.tempLocation} commit --allow-empty -m "${escapedMessage}"`)
    .then(this.gitPullChanges.bind(this))
    .catch(swollowErrors)
    .then(this.gitPushChanges.bind(this));
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        console.log(command);
        if (error) {
          return reject(error);
        }
        resolve(stdout);
      });
    });
  }
}

module.exports = GitEventStorage;
