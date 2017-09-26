import { commentAddedEventType } from 'lib/event-definitions';

export default class CommentAdded {
  forEvent() { return commentAddedEventType; }

  execute({ stateManager, event }) {
    const card = stateManager.objectData('cards', event.data.cardId);
    if (!card) return;

    const eventData = event.data;
    eventData.createdAt = event.createdAt || event.data.createdAt;

    stateManager.addObject('comments', eventData);
  }
}
