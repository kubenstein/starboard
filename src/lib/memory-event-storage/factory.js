import MemoryEventStorage from '../memory-event-storage/';
import frontendFilesHandler from './frontend-files-handler';
import backendFilesHandler from './backend-with-files-storage-files-handler';

export default class MemoryEventStorageFactory {
  forFrontend(params = {}) {
    return this.storageWithFileHander(frontendFilesHandler, params.logger);
  }

  forBackendWithStoredFiles(params = {}) {
    return this.storageWithFileHander(backendFilesHandler, params.logger);
  }

  // private

  storageWithFileHander(fileHandler, logger) {
    return new MemoryEventStorage({
      logger: logger,
      addFileHandler: fileHandler
    });
  }
}
