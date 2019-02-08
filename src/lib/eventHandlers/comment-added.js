import { commentAddedEventType } from 'lib/event-definitions';

export default class CommentAdded {
  forEvent() { return commentAddedEventType; }

  execute({ stateManager, event }) {
    const { data, data: { cardId, createdAt }, createdAt: eventCreatedAt } = event;
    const card = stateManager.objectData('cards', cardId);
    if (!card) return;

    const eventData = {
      ...data,
      createdAt: eventCreatedAt || createdAt,
    };

    stateManager.addObject('comments', eventData);
  }
}
