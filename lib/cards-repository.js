import {
  cardAddedEvent,
  cardUpdatedEvent,
  cardRemovedEvent
} from './event-definitions.js';

export default class CardsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getCardsForColumn(columnId) {
    const bucket = this.stateManager.bucket('cards');
    return bucket
      .filter(c => c.columnId === columnId)
      .sort((c1, c2) => c1.position - c2.position);
  }

  addCard(title, columnId) {
    const lastCard = this.getCardsForColumn(columnId)[0] || { position: 0 };
    const lastPosition = lastCard.position + 1;

    const event = cardAddedEvent({
      columnId: columnId,
      position: lastPosition,
      title: title
    });
    return this.stateManager.addEvent(event);
  }

  updateCard(id, changes) {
    const event = cardUpdatedEvent(id, changes);
    return this.stateManager.addEvent(event);
  }

  removeCard(cardId) {
    const event = cardRemovedEvent(cardId);
    return this.stateManager.addEvent(event);
  }
}
