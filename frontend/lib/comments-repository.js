export default class CommentsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getCommentsForCard(cardId) {
    const bucket = this.stateManager.bucket('comments');
    return bucket.filter(c => c.cardId === cardId);
  }
}
