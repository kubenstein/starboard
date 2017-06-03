import {
  commentAddedEvent,
  commentUpdatedEvent,
  commentRemovedEvent
} from './event-definitions.js';

export default class CommentsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  get(id) {
    const bucket = this.stateManager.bucket('comments');
    return bucket.filter(c => c.id === id)[0];
  }

  commentsCountForCard(cardId) {
    const bucket = this.stateManager.bucket('comments');
    return bucket
           .filter(c => c.cardId === cardId)
           .length;
  }

  commentsForCard(cardId) {
    const bucket = this.stateManager.bucket('comments');
    return bucket
           .filter(c => c.cardId === cardId)
           .sort((c1, c2) => c2.createdAt - c1.createdAt);
  }

  addComment(cardId, params) {
    const { attachment } = params;
    if (attachment) {
      return this.addCommentWithAttachment(cardId, params);
    }

    return this.addCommentWithoutAttachment(cardId, params);
  }

  updateComment(id, changes) {
    const event = commentUpdatedEvent(id, changes);
    return this.stateManager.addEvent(event);
  }

  removeComment(commentId) {
    const event = commentRemovedEvent(commentId);
    return this.stateManager.addEvent(event);
  }


  // private

  addCommentWithAttachment(cardId, params) {
    const { content, attachment, authorId } = params;

    return this.stateManager.addFile(attachment.blob)
    .then((attachmentUrl) => {
      const event = commentAddedEvent(cardId, {
        content: content,
        authorId: authorId,
        attachmentName: attachment.name,
        attachmentSize: attachment.size,
        attachmentType: attachment.type,
        attachmentUrl: attachmentUrl
      });
      return this.stateManager.addEvent(event);
    });
  }

  addCommentWithoutAttachment(cardId, params) {
    const { content, authorId } = params;

    const event = commentAddedEvent(cardId, {
      content: content,
      authorId: authorId,
    });
    return this.stateManager.addEvent(event);
  }
}
