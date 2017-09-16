import { commentRemovedEventType } from '../event-definitions';

export default class CommentRemoved {
  static forEvent() { return commentRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const { commentId } = event.data;
    this.currentState.removeObject('comments', commentId);
  }
}
