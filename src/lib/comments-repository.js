import {
  commentAddedEvent,
  commentRemovedEvent
} from './event-definitions.js';

export default class CommentsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getCommentsForCard(cardId) {
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

  removeComment(commentId) {
    const event = commentRemovedEvent(commentId);
    return this.stateManager.addEvent(event);
  }


  // private

  addCommentWithAttachment(cardId, params) {
    const { content, attachment } = params;
    const user = this.stateManager.currentUser();

    return this.stateManager.addFile(attachment.blob)
    .then((attachmentUrl) => {
      const event = commentAddedEvent(cardId, {
        content: content,
        authorName: user.name,
        authorEmail: user.email,
        attachmentName: attachment.name,
        attachmentSize: attachment.size,
        attachmentType: attachment.type,
        attachmentUrl: attachmentUrl
      });
      return this.stateManager.addEvent(event);
    });
  }

  addCommentWithoutAttachment(cardId, params) {
    const { content } = params;
    const user = this.stateManager.currentUser();

    const event = commentAddedEvent(cardId, {
      content: content,
      authorName: user.name,
      authorEmail: user.email,
    });
    return this.stateManager.addEvent(event);
  }
}
