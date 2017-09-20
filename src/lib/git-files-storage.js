import uuid from 'uuid/v4';
import fs from 'fs';
import { hasToBeSet } from 'lib/utils';
import { noopEvent } from 'lib/event-definitions';

export default class GitFilesStorage {
  constructor(params) {
    this.git = params.gitContainer || hasToBeSet('gitContainer');
  }

  fileUrl(filePath) {
    return `${this.git.pathToTempLocalRepo}${filePath}`;
  }

  rootPath() {
    return this.git.pathToTempLocalRepo;
  }

  addFile(params) {
    const { fileName, filePath } = params;

    const uniqueFileName = `${uuid()}---${fileName}`;
    const uniqueFilePath = this.fileUrl(uniqueFileName);

    return new Promise((resolve, reject) => {
      fs.rename(filePath, uniqueFilePath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => { return this.git.addFile(uniqueFileName, this.fileAddingCommitMassage(uniqueFileName)); })
    .then(() => { return uniqueFileName; });
  }

  // private

  fileAddingCommitMassage(filePath) {
    return JSON.stringify(noopEvent(`storing a file: ${filePath}`));
  }
}
