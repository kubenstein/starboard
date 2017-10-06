import { hasToBeSet } from 'lib/utils';

export default class SendFileUsecase {
  constructor(params = {}) {
    this.filesStorage = params.filesStorage || hasToBeSet('filesStorage');
  }

  sendResponse(params) {
    const { fileName, expressResponse } = params;
    const fileUrl = this.filesStorage.fileUrl(fileName);
    if (this.isLocal(fileUrl)) {
      expressResponse.sendFile(fileName, {
        dotfiles: 'deny',
        root: this.filesStorage.rootPath(),
      });
    } else {
      expressResponse.redirect(fileUrl);
    }
  }

  // private

  isLocal(fileUrl) {
    return (fileUrl[0] === '/');
  }
}
