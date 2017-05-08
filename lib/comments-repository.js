import uuid from 'uuid/v4';


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
    const addCommentEvent = {
      id: uuid(),
      type: 'ADD_COMMENT',
      data: {
        id: uuid(),
        createdAt: (Math.floor(Date.now() / 1000)),
        cardId: cardId,
        content: content,
        author: { name: 'Kuba' }
      }
    };
    return this.stateManager.addEvent(addCommentEvent);
  }

  removeComment(commentId) {
    const removeCommentEvent = {
      id: uuid(),
      type: 'REMOVE_COMMENT',
      data: { commentId: commentId }
    };
    return this.stateManager.addEvent(removeCommentEvent);
  }
}
