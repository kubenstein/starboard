import { hasToBeSet } from './utils';
import { fileAddedEvent } from './event-definitions';

export default class StoreFileUsecase {
  constructor(params = {}) {
    this.filesStorage = params.filesStorage || hasToBeSet('filesStorage');
    this.eventStorage = params.eventStorage || hasToBeSet('eventStorage');
    this.fileAddingRequester = 'Starboard BOT';
  }

  addFile(multerFile) {
    const originalFileName = multerFile.originalname;
    const originalFilePath = multerFile.path;

    return this.filesStorage.addFile({
      fileName: originalFileName,
      filePath: originalFilePath
    }).then((fileName) => {
      return `/attachments/${fileName}`;
    }).then((fileUrl) => {
      this.eventStorage.addEvent(
        fileAddedEvent(this.fileAddingRequester, fileUrl)
      );
      return fileUrl;
    });
  }
}
