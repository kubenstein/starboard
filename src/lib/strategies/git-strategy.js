import { hasToBeSet } from 'lib/utils';
import NullLogger from 'lib/null-logger';
import GitContainer from 'lib/git-container';
import GitEventStorage from 'lib/eventStorages/git-event-storage';
import GitFilesStorage from 'lib/git-files-storage';
import StoreFileService from 'lib/services/store-file-service';
import AllowAllAuth from 'lib/allow-all-auth';

export default class GitStrategy {
  constructor(params = {}) {
    const pathToTempLocalRepo = params.pathToTempLocalRepo || hasToBeSet('pathToTempLocalRepo');
    const remoteRepoUrl = params.remoteRepoUrl || hasToBeSet('remoteRepoUrl');
    const logger = params.logger || new NullLogger();

    this.gitContainer = new GitContainer({
      pathToTempLocalRepo: pathToTempLocalRepo,
      remoteRepoUrl: remoteRepoUrl,
      logger: logger,
    });
    this.eventStorage = new GitEventStorage({ gitContainer: this.gitContainer });
    this.filesStorage = new GitFilesStorage({ gitContainer: this.gitContainer });
    this.storeFileService = new StoreFileService({ filesStorage: this.filesStorage, eventStorage: this.eventStorage });
    this.auth = new AllowAllAuth();
  }

  storeFile(multerFile, token) {
    return this.auth.allowStoringFile(token).then((can) => {
      if (can) {
        return this.storeFileService.storeFile(multerFile);
      } else {
        return Promise.reject();
      }
    });
  }

  getFileUrl(fileName, token) {
    return this.auth.allowDownloadingFile(fileName, token).then((can) => {
      if (can) {
        return this.filesStorage.fileUrl(fileName);
      } else {
        return Promise.reject();
      }
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
      if (can) {
        return this.eventStorage.addEvent(event);
      } else {
        return Promise.reject();
      }
    });
  }
}
