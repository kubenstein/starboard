import { commentAddedEventType } from '../event-definitions.js';

export default class CommentAdded {
  static forEvent() { return commentAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.addObject('comments', event.data);
  }
}
