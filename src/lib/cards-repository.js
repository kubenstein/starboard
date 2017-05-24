import {
  cardAddedEvent,
  cardUpdatedEvent,
  cardRemovedEvent,
  cardLabelToggledEvent
} from './event-definitions.js';

export default class CardsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getCard(id) {
    const bucket = this.stateManager.bucket('cards');
    return bucket.filter(c => c.id === id)[0];
  }

  getCardsSortedByPosition(columnId) {
    const bucket = this.stateManager.bucket('cards');
    return bucket
      .filter(c => c.columnId === columnId)
      .sort((c1, c2) => c1.position - c2.position);
  }

  addCard(title, columnId) {
    const lastCard = this.getCardsSortedByPosition(columnId).reverse()[0] || { position: -1 };
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

  toggleLabel(cardId, label) {
    const event = cardLabelToggledEvent(cardId, label);
    return this.stateManager.addEvent(event);
  }

  removeCard(cardId) {
    const event = cardRemovedEvent(cardId);
    return this.stateManager.addEvent(event);
  }
}
