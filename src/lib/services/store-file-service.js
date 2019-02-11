import { hasToBeSet } from 'lib/utils';
import { fileAddedEvent } from 'lib/event-definitions';

export default class StoreFileService {
  constructor(params = {}) {
    this.filesStorage = params.filesStorage || hasToBeSet('filesStorage');
    this.eventStorage = params.eventStorage || hasToBeSet('eventStorage');
    this.fileAddingRequester = 'Starboard BOT';
  }

  storeFile(multerFile) {
    const originalFileName = multerFile.originalname;
    const originalFilePath = multerFile.path;

    return this.filesStorage.addFile({
      fileName: originalFileName,
      filePath: originalFilePath,
    }).then(fileName => `/attachments/${fileName}`)
      .then((fileUrl) => {
        this.eventStorage.addEvent(fileAddedEvent(this.fileAddingRequester, fileUrl));
        return fileUrl;
      });
  }
}
