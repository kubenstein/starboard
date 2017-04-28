export default class CommentsRepository {
  constructor(store) {
    this.store = store;
  }

  getCommentsForCard(cardId) {
    const bucket = this.store.bucket('comments');
    return bucket.filter(c => c.cardId === cardId);
  }
}
