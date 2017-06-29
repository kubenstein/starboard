const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const utils = require('../support/utils.js');
const GitEventStorage = require('../../components.js').lib.GitEventStorage;

let remoteRepoPath;
let tmpRepoPath;
let storage;

describe('GitEventStorage', () => {
  beforeEach(() => {
    remoteRepoPath = utils.generateRemoteRepoPath();
    tmpRepoPath = utils.generateTmpRepoPath();

    storage = new GitEventStorage({
      remoteRepoUrl: remoteRepoPath,
      pathToTempLocalRepo: tmpRepoPath,
      syncingInterval: -1
    });
  });

  it('pushes all local events during sync', () => {
    return Promise.all([
      storage.addEvent({ eventType: 'event1' }),
      storage.addEvent({ eventType: 'event2' }),
      storage.addEvent({ eventType: 'event3' }),
    ]).then(() => {
      expect(gitRemoteLog()).not.to.include('event1');
    }).then(() => {
      return storage.sync();
    }).then(() => {
      expect(gitRemoteLog()).to.include('event1');
      expect(gitRemoteLog()).to.include('event2');
      expect(gitRemoteLog()).to.include('event3');
    });
  });

  it('pulls new events from remote during sync', () => {
    addEventsToRemote([
      { eventType: 'event1' },
      { eventType: 'event2' },
      { eventType: 'event3' },
    ]);

    return storage.sync()
    .then(() => {
      const log = gitLog(tmpRepoPath);
      expect(log).to.include('event1');
      expect(log).to.include('event2');
      expect(log).to.include('event3');
    });
  });

  it('applies only new events from remote after sync', () => {
    const appliedEvents = [];
    const observer = {
      onNewEvent: (event) => {
        appliedEvents.push(event);
      }
    };

    addEventsToRemote([
      { id: 'remoteEvent1' },
      { id: 'remoteEvent2' },
      { id: 'remoteEvent3' },
    ]);

    return Promise.all([
      storage.addEvent({ id: 'localEvent1' }),
      storage.addEvent({ id: 'localEvent2' }),
      storage.addEvent({ id: 'localEvent3' }),
    ]).then(() => {
      storage.addObserver(observer);
      return storage.sync();
    }).then(() => {
      expect(appliedEvents.length).to.eq(3);
      expect(appliedEvents[0].id).to.eq('remoteEvent1');
      expect(appliedEvents[1].id).to.eq('remoteEvent2');
      expect(appliedEvents[2].id).to.eq('remoteEvent3');
    });
  });

  it('rebases local events on top of remote during sync', () => {
    addEventsToRemote([
      { id: 'remoteEvent' },
    ]);

    return storage.addEvent({ id: 'localEvent' })
    .then(() => {
      return storage.sync();
    }).then(() => {
      const commitsFromNewestToOldest = gitRemoteLog().split('\n');
      expect(commitsFromNewestToOldest[0]).to.include('localEvent');
      expect(commitsFromNewestToOldest[1]).to.include('remoteEvent');
    });
  });

  // // private

  function gitLog(pathToRepo) {
    return execSync(`git -C ${pathToRepo} log --oneline __starboard-data`).toString();
  }

  function gitRemoteLog() {
    return gitLog(remoteRepoPath);
  }

  function addEventsToRemote(events) {
    const tmpDir = utils.generateTmpRepoPath();
    execSync(`git init ${tmpDir}`);
    execSync(`git -C ${tmpDir} remote add remoteRepo ${remoteRepoPath}`);
    events.forEach((event) => {
      execSync(`git -C ${tmpDir} commit --allow-empty -m '${JSON.stringify(event)}'`);
    });
    execSync(`git -C ${tmpDir} push --quiet remoteRepo master:__starboard-data`);
  }
});
