import { hasToBeSet } from './utils';

export default class StoreFileUsecase {
  constructor(params = {}) {
    this.filesStorage = params.filesStorage || hasToBeSet('filesStorage');
  }

  addFile(multerFile) {
    const originalFileName = multerFile.originalname;
    const originalFilePath = multerFile.path;

    return this.filesStorage.addFile({
      fileName: originalFileName,
      filePath: originalFilePath
    }).then((fileName) => {
      return `/attachments/${fileName}`;
    });
  }
}
