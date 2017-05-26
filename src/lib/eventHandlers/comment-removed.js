import { commentRemovedEventType } from '../event-definitions.js';

export default class CommentRemoved {
  static forEvent() { return commentRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const commentId = event.data.commentId;
    this.currentState.removeObject('comments', commentId);
  }
}
