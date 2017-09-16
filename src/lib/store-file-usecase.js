import uuid from 'uuid/v4';
import fs from 'fs';
import { hasToBeSet } from './utils';

export default class StoreFileUsecase {
  constructor(eventStorage, params = {}) {
    this.eventStorage = eventStorage;
    this.storedFilesDir = params.storedFilesDir || hasToBeSet('storedFilesDir');
  }

  addFile(multerFile) {
    const originalFileName = multerFile.originalname;
    const originalFilePath = multerFile.path;
    const uniqueFileName = `${uuid()}---${originalFileName}`;
    const uniqueFilePath = `${this.storedFilesDir}${uniqueFileName}`;

    return new Promise((resolve, reject) => {
      fs.rename(originalFilePath, uniqueFilePath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => { return this.eventStorage.addFile(uniqueFileName); });
  }
}
