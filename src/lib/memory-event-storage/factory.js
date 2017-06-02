import MemoryEventStorage from '../memory-event-storage.js';
import frontendFilesHandler from './frontend-files-handler.js';
import backendFilesHandler from './backend-with-files-storage-files-handler.js';

export default class MemoryEventStorageFactory {
  forFrontend(params) {
    return this.storageWithFileHander(frontendFilesHandler, params.logger);
  }

  forBackendWithStoredFiles(params) {
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
