import fs from 'fs';
import CommentsRepository from './comments-repository.js';
import { cardRemovedEventType, commentRemovedEventType } from './event-definitions.js';

export default class CleanFilesUsecase {
  constructor(currentState, params) {
    this.currentState = currentState;
    this.pathToStorage = params.pathToStorage;
    this.fileNamePrefix = params.fileNamePrefix;
    this.commentsRepo = new CommentsRepository(this.currentState);
  }

  cleanWhenNeeded(event) {
    const t = event.type;
    if (t === commentRemovedEventType) return this.removeAllFilesFromCommentByCommentId(event.data.commentId);
    if (t === cardRemovedEventType) return this.removeAllFilesFromCardComments(event.data.cardId);
    return Promise.resolve();
  }

  // private

  removeAllFilesFromCommentByCommentId(commentId) {
    const comment = this.commentsRepo.get(commentId);
    return this.removeAllFilesFromComment(comment);
  }

  removeAllFilesFromCardComments(cardId) {
    const comments = this.commentsRepo.getCommentsForCard(cardId);
    const promises = comments.map((c) => {
      return this.removeAllFilesFromComment(c);
    });
    return Promise.all(promises);
  }

  removeAllFilesFromComment(comment) {
    if (!comment.attachment) return Promise.resolve();

    const filePublicUrl = comment.attachment.dataUrl;
    const fileName = filePublicUrl.replace(this.fileNamePrefix, '');
    const filePath = `${this.pathToStorage}/${fileName}`;

    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => { return err ? reject(err) : resolve(); });
    })
    .then(() => {
      return this.currentState.removeFile(fileName);
    });
  }
}
