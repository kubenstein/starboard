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

  addComment(cardId, content) {
    const event = commentAddedEvent(cardId, {
      content: content
    });
    return this.stateManager.addEvent(event);
  }

  removeComment(commentId) {
    const event = commentRemovedEvent(commentId)
    return this.stateManager.addEvent(event);
  }
}
