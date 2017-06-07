import MemoryEventStorage from '../memory-event-storage.js';
import frontendFilesHandler from './frontend-files-handler.js';
import backendFilesHandler from './backend-with-files-storage-files-handler.js';

export default class MemoryEventStorageFactory {
  forFrontend(params) {
    const attr = params || {};
    return this.storageWithFileHander(frontendFilesHandler, attr.logger);
  }

  forBackendWithStoredFiles(params) {
    const attr = params || {};
    return this.storageWithFileHander(backendFilesHandler, attr.logger);
  }

  // private

  storageWithFileHander(fileHandler, logger) {
    return new MemoryEventStorage({
      logger: logger,
      addFileHandler: fileHandler
    });
  }
}
