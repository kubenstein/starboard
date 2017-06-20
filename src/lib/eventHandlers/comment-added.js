import { commentAddedEventType } from '../event-definitions.js';

export default class CommentAdded {
  static forEvent() { return commentAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = this.currentState.objectData('cards', event.data.cardId);
    if (!card) return;

    this.currentState.addObject('comments', event.data);
  }
}
