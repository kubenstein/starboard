import uuid from 'uuid/v4';
import fs from 'fs';

export default class StoreAttachmentUsecase {
  constructor(eventStorage, params) {
    this.eventStorage = eventStorage;
    this.pathToStorage = params.pathToStorage;
  }

  addFile(tempPath) {
    const attachmentName = uuid();
    const attachmentPath = `${this.pathToStorage}${attachmentName}`;

    return new Promise((resolve, reject) => {
      fs.rename(tempPath, attachmentPath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => { return this.eventStorage.addFile(attachmentName); })
    .then(() => { return attachmentName; });
  }
}
