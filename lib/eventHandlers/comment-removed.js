import { commentRemovedEventType } from '../event-definitions.js';

export default class CommentRemoved {
  static forEvent() { return commentRemovedEventType; }

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
