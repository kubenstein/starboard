import uuid from 'uuid/v4';
import fs from 'fs';

export default class StoreFileUsecase {
  constructor(eventStorage, params) {
    this.eventStorage = eventStorage;
    this.pathToStorage = params.pathToStorage;
  }

  addFile(file) {
    const originalName = file.originalname;
    const attachmentName = `${uuid()}---${originalName}`;
    const attachmentPath = `${this.pathToStorage}${attachmentName}`;
    const tempPath = file.path;
    return new Promise((resolve, reject) => {
      fs.rename(tempPath, attachmentPath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => { return this.eventStorage.addFile(attachmentName); })
    .then(() => { return attachmentName; });
  }
}
