/* eslint-disable no-var, vars-on-top, no-use-before-define */

import path from 'path';
import { expect } from 'chai';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import * as utils from '../support/utils';
import lib from '../../components';

const { GitEventStorage } = lib;

var remoteRepoPath;
var tmpRepoPath;
var storage;

describe('GitEventStorage', () => {
  beforeEach(() => {
    remoteRepoPath = utils.generateRemoteRepoPath();
    tmpRepoPath = utils.generateTmpRepoPath();

    storage = new GitEventStorage({
      remoteRepoUrl: remoteRepoPath,
      pathToTempLocalRepo: tmpRepoPath,
      syncingInterval: -1,
    });
  });

  it('saves an event to a git repo', () => {
    const event = dummyEvent();
    return storage.addEvent(event).then(() => {
      expect(gitLog()).to.include(JSON.stringify(event));
    });
  });

  it('notifies about new event', () => {
    var notifiedEvent;
    const observer = {
      onNewEvent: (event) => {
        notifiedEvent = event;
      },
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
      storage.addEvent(event),
    ])
      .then(() => (
        storage.allPastEvents().then((events) => {
          expect(getAllDummyEvents(events).length).to.eq(4);
        })
      ));
  });

  it('saves/removes a file', () => {
    fs.copySync(
      path.join(__dirname, '../support/files/image.jpg'),
      path.join(tmpRepoPath, 'image.jpg'),
    );
    fs.copySync(
      path.join(__dirname, '../support/files/picture.jpg'),
      path.join(tmpRepoPath, 'picture.jpg'),
    );

    return Promise.resolve()
      .then(() => storage.addFile('image.jpg'))
      .then(() => storage.addFile('picture.jpg'))
      .then(() => {
        expect(gitFiles()).to.include('image.jpg');
        expect(gitFiles()).to.include('picture.jpg');
      })
      .then(() => storage.removeFile('image.jpg'))
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
});
