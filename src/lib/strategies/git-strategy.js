import { hasToBeSet } from 'lib/utils';
import NullLogger from 'lib/null-logger';
import GitEventStorage from 'lib/eventStorages/git-event-storage';
import GitFilesStorage from 'lib/git-files-storage';
import StoreFileService from 'lib/services/store-file-service';
import AllowAllAuth from 'lib/allow-all-auth';

export default class GitStrategy {
  constructor(params) {
    const {
      gitContainer = hasToBeSet('gitContainer'),
      logger = new NullLogger(),
      remoteRepoSyncingInterval,
    } = params;

    this.eventStorage = new GitEventStorage({
      syncingInterval: remoteRepoSyncingInterval,
      gitContainer,
      logger,
    });

    this.filesStorage = new GitFilesStorage({
      gitContainer,
      logger,
    });

    this.storeFileService = new StoreFileService({
      filesStorage: this.filesStorage,
      eventStorage: this.eventStorage,
      logger,
    });

    this.auth = new AllowAllAuth();

    this.onNewEvent = () => {};
    this.eventStorage.addObserver(this);
  }

  info() {
    return [
      'Git Strategy',
      this.eventStorage.info(),
      this.filesStorage.info(),
      this.auth.info(),
    ].join('\n');
  }

  onNewAsyncEvent(callback) {
    this.onNewEvent = callback;
  }

  storeFile(multerFile, token) {
    return this.auth.allowStoringFile(token).then((can) => {
      if (!can) return Promise.reject();
      return this.storeFileService.storeFile(multerFile);
    });
  }

  getFileUrl(fileName, token) {
    return this.auth.allowDownloadingFile(fileName, token).then((can) => {
      if (!can) return Promise.reject();
      return this.filesStorage.fileUrl(fileName);
    });
  }

  authWithCredentials(email, password) {
    return this.auth.authWithCredentials(email, password);
  }

  authWithToken(token) {
    return this.auth.authWithToken(token);
  }

  allPastEvents(_token) {
    return this.eventStorage.allPastEvents();
  }

  processEvent(event, token) {
    return this.auth.allowEvent(event, token).then((can) => {
      if (!can) return Promise.reject();
      return this.eventStorage.addEvent(event)
        .then(addedEvent => this.onNewEventCallback(addedEvent));
    });
  }
}
