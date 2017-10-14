import {
  cardAddedEvent,
  cardUpdatedEvent,
  cardRemovedEvent,
  cardLabelUpdatedEvent,
  cardMemberUpdatedEvent,
} from 'lib/event-definitions';

export default class CardsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  get(id) {
    const bucket = this.stateManager.bucket('cards');
    return bucket.filter(c => c.id === id)[0];
  }

  cardExists(id) {
    return !!this.get(id);
  }

  cardsByColumn(columnId) {
    const bucket = this.stateManager.bucket('cards');
    return bucket.filter(c => c.columnId === columnId);
  }

  cardsSortedByPosition(columnId) {
    return this.cardsByColumn(columnId)
      .sort((c1, c2) => c1.position - c2.position);
  }

  addCard(title, columnId) {
    const requesterId = this.stateManager.getUserId();
    const lastCard = this.cardsSortedByPosition(columnId).reverse()[0] || { position: -1 };
    const lastPosition = lastCard.position + 1;

    const event = cardAddedEvent(requesterId, {
      columnId: columnId,
      position: lastPosition,
      title: title,
    });
    return this.stateManager.addEvent(event);
  }

  updateCard(id, changes) {
    const requesterId = this.stateManager.getUserId();
    const event = cardUpdatedEvent(requesterId, id, changes);
    return this.stateManager.addEvent(event);
  }

  updateLabel(cardId, label, labelWillBeSet) {
    const requesterId = this.stateManager.getUserId();
    const event = cardLabelUpdatedEvent(requesterId, cardId, label, labelWillBeSet);
    return this.stateManager.addEvent(event);
  }

  updateMember(cardId, userId, userWillBeAdded) {
    const requesterId = this.stateManager.getUserId();
    const event = cardMemberUpdatedEvent(requesterId, cardId, userId, userWillBeAdded);
    return this.stateManager.addEvent(event);
  }

  removeCard(cardId) {
    const requesterId = this.stateManager.getUserId();
    const event = cardRemovedEvent(requesterId, cardId);
    return this.stateManager.addEvent(event);
  }
}
