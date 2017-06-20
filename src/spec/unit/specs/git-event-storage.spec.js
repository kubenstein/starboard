const path = require('path');
const expect = require('chai').expect;
const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const GitEventStorage = require('../components.js').lib.GitEventStorage;

let remoteRepoPath;
let tmpRepoPath;
let storage;

describe('GitEventStorage', () => {
  beforeEach(() => {
    remoteRepoPath = generateRemoteRepoPath();
    tmpRepoPath = generateTmpRepoPath();

    storage = new GitEventStorage({
      remoteRepoUrl: remoteRepoPath,
      pathToTempLocalRepo: tmpRepoPath,
      syncingInterval: -1
    });
  });

  it('saves an event to a git repo', () => {
    const event = dummyEvent();
    return storage.addEvent(event).then(() => {
      expect(gitLog()).to.include(JSON.stringify(event));
    });
  });

  it('notifies about new event', () => {
    let notifiedEvent;
    const observer = {
      onNewEvent: (event) => {
        notifiedEvent = event;
      }
    };
    storage.addObserver(observer);

    const event = dummyEvent();
    return storage.addEvent(event).then(() => {
      expect(notifiedEvent).to.eql(event);
    });
  });

  it('returns all events', () => {
    const event = dummyEvent();
    return Promise.all([
      storage.addEvent(event),
      storage.addEvent(event),
      storage.addEvent(event),
      storage.addEvent(event)
    ]).then(() => {
      return storage.allPastEvents().then((events) => {
        expect(getAllDummyEvents(events).length).to.eq(4);
      });
    });
  });

  it('saves/removes a file', () => {
    fs.copySync(
      path.join(__dirname, './support/files/image.jpg'),
      path.join(tmpRepoPath, 'image.jpg')
    );
    fs.copySync(
      path.join(__dirname, './support/files/picture.jpg'),
      path.join(tmpRepoPath, 'picture.jpg')
    );

    return Promise.resolve().then(() => {
      return storage.addFile('image.jpg');
    })
    .then(() => {
      return storage.addFile('picture.jpg');
    })
    .then(() => {
      expect(gitFiles()).to.include('image.jpg');
      expect(gitFiles()).to.include('picture.jpg');
    })
    .then(() => {
      return storage.removeFile('image.jpg');
    })
    .then(() => {
      expect(gitFiles()).not.to.include('image.jpg');
      expect(gitFiles()).to.include('picture.jpg');
    });
  });

  // private

  function dummyEvent() {
    return { eventType: 'dummy' };
  }

  function getAllDummyEvents(events) {
    return events.filter(event => event.eventType === dummyEvent().eventType);
  }

  function gitLog() {
    return execSync(`git -C ${tmpRepoPath} log --oneline __starboard-data`).toString();
  }

  function gitFiles() {
    return execSync(`git -C ${tmpRepoPath} ls-files`).toString();
  }

  function generateTmpRepoPath() {
    return `/tmp/starboard-git-specs/gitStorageLocalRepo_${Math.random()}`;
  }

  function generateRemoteRepoPath() {
    const p = `/tmp/starboard-git-specs/gitStorageRemoteRepo_${Math.random()}`;
    fs.mkdirSync(p);
    execSync(`git init --bare ${p}`);
    return p;
  }
});
