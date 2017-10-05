import FileUploaderService from 'lib/services/file-uploader-service';
import {
  commentAddedEvent,
  commentRemovedEvent,
} from 'lib/event-definitions';

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
    const requesterId = this.stateManager.getUserId();
    const { attachment } = params;
    if (attachment) {
      return this.addCommentWithAttachment(requesterId, cardId, params);
    }

    return this.addCommentWithoutAttachment(requesterId, cardId, params);
  }

  removeComment(commentId) {
    const requesterId = this.stateManager.getUserId();
    const event = commentRemovedEvent(requesterId, commentId);
    return this.stateManager.addEvent(event);
  }

  // private

  addCommentWithAttachment(requesterId, cardId, params) {
    const { content, attachment } = params;
    const fileUploader = new FileUploaderService();

    return fileUploader.uploadFileFromFileBlob(attachment.blob)
    .then((attachmentUrl) => {
      const event = commentAddedEvent(requesterId, cardId, {
        content: content,
        attachmentName: attachment.name,
        attachmentSize: attachment.size,
        attachmentType: attachment.type,
        attachmentUrl: attachmentUrl,
      });
      return this.stateManager.addEvent(event);
    });
  }

  addCommentWithoutAttachment(requesterId, cardId, params) {
    const { content } = params;

    const event = commentAddedEvent(requesterId, cardId, {
      content: content,
    });
    return this.stateManager.addEvent(event);
  }
}
