import {
  columnRemovedEventType,
  cardRemovedEvent
} from 'lib/event-definitions';
import CardsRepository from 'lib/repositories/cards-repository';
import CardRemovedEventHandler from './card-removed';
import repositionAllColumns from './support/reposition-all-columns';

export default class ColumnRemoved {
  static forEvent() { return columnRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const column = this.currentState.objectData('columns', event.data.columnId);
    if (!column) return;

    this.removeAllCards(column);
    this.removeColumn(column);
    repositionAllColumns(this.currentState);
  }

  // private

  removeAllCards(column) {
    const cardRemovedEventHandler = new CardRemovedEventHandler(this.currentState);
    const cardsRepo = new CardsRepository(this.currentState);

    cardsRepo.cardsByColumn(column.id).forEach((card) => {
      const proxyEvent = cardRemovedEvent('proxyRequester', card.id);
      cardRemovedEventHandler.execute(proxyEvent);
    });
  }

  removeColumn(column) {
    this.currentState.removeObject('columns', column.id);
  }
}
