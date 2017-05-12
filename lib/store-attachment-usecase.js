import uuid from 'uuid/v4';
import fs from 'fs';

export default class StoreAttachmentUsecase {
  constructor(eventStorage, params) {
    this.eventStorage = eventStorage;
    this.pathToStorage = params.pathToStorage;
  }

  addFile(tempPath) {
    const fileName = tempPath.split('/').reverse()[0];
    const fileExtension = fileName.split('.').reverse()[0];
    const attachmentName = `${uuid()}.${fileExtension}`;
    const attachmentPath = `${this.pathToStorage}${attachmentName}`;

    return new Promise((resolve, reject) => {
      fs.rename(tempPath, attachmentPath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => { return this.eventStorage.addFile(attachmentPath); })
    .then(() => { return attachmentName; });
  }
}
