import {
  cardAddedEvent,
  cardUpdatedEvent,
  cardRemovedEvent,
  cardLabelUpdatedEvent
} from './event-definitions.js';

export default class CardsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  get(id) {
    const bucket = this.stateManager.bucket('cards');
    return bucket.filter(c => c.id === id)[0];
  }

  cardsSortedByPosition(columnId) {
    const bucket = this.stateManager.bucket('cards');
    return bucket
      .filter(c => c.columnId === columnId)
      .sort((c1, c2) => c1.position - c2.position);
  }

  addCard(title, columnId) {
    const lastCard = this.cardsSortedByPosition(columnId).reverse()[0] || { position: -1 };
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

  updateLabel(cardId, label, labelWillBeSet) {
    const event = cardLabelUpdatedEvent(cardId, label, labelWillBeSet);
    return this.stateManager.addEvent(event);
  }

  removeCard(cardId) {
    const event = cardRemovedEvent(cardId);
    return this.stateManager.addEvent(event);
  }
}
