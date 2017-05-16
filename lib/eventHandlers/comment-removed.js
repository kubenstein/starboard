export default class CommentRemoved {
  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const commentId = event.data.commentId;
    const bucket = this.currentState.bucket('comments');
    const commentIndex = bucket.findIndex(comment => comment.id === commentId);
    bucket.splice(commentIndex, 1);
  }
}
