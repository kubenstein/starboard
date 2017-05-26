import fs from 'fs';
import CommentsRepository from './comments-repository.js';
import CardsRepository from './cards-repository.js';
import {
  columnRemovedEventType,
  cardRemovedEventType,
  commentRemovedEventType
} from './event-definitions.js';

export default class CleanFilesUsecase {
  constructor(currentState, params) {
    this.currentState = currentState;
    this.pathToStorage = params.pathToStorage;
    this.fileNamePrefix = params.fileNamePrefix;
    this.commentsRepo = new CommentsRepository(this.currentState);
    this.cardsRepo = new CardsRepository(this.currentState);
  }

  cleanWhenNeeded(event) {
    const t = event.type;
    if (t === columnRemovedEventType) return this.removeColumnRelatedFiles(event.data.columnId);
    if (t === cardRemovedEventType) return this.removeCardRelatedFiles(event.data.cardId);
    if (t === commentRemovedEventType) return this.removeCommentRelatedFiles(event.data.commentId);
    return Promise.resolve();
  }

  // private

  removeColumnRelatedFiles(columnId) {
    const cards = this.cardsRepo.cardsSortedByPosition(columnId);
    const promises = cards.map((card) => {
      return this.removeCardRelatedFiles(card.id);
    });
    return Promise.all(promises);
  }

  removeCardRelatedFiles(cardId) {
    const comments = this.commentsRepo.commentsForCard(cardId);
    const promises = comments.map((comment) => {
      return this.removeAttachment(comment);
    });
    return Promise.all(promises);
  }

  removeCommentRelatedFiles(commentId) {
    const comment = this.commentsRepo.get(commentId);
    return this.removeAttachment(comment);
  }

  removeAttachment(comment) {
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
