import { commentAddedEventType } from 'lib/event-definitions';

export default class CommentAdded {
  static forEvent() { return commentAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = this.currentState.objectData('cards', event.data.cardId);
    if (!card) return;

    const eventData = event.data;
    eventData.createdAt = event.createdAt || event.data.createdAt;

    this.currentState.addObject('comments', eventData);
  }
}
