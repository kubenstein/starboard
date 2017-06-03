import { commentUpdatedEventType } from '../event-definitions.js';

export default class CommentUpdated {
  static forEvent() { return commentUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const commentId = event.data.commentId;
    const changes = event.data.changes;
    this.currentState.updateObject('comments', commentId, changes);
  }
}
