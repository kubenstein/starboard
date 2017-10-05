import {
  columnRemovedEventType,
  cardRemovedEvent,
} from 'lib/event-definitions';
import CardsRepository from 'lib/repositories/cards-repository';
import CardRemovedEventHandler from './card-removed';
import repositionAllColumns from './support/reposition-all-columns';

export default class ColumnRemoved {
  forEvent() { return columnRemovedEventType; }

  execute({ stateManager, event }) {
    this.stateManager = stateManager;

    const column = this.stateManager.objectData('columns', event.data.columnId);
    if (!column) return;

    this.removeAllCards(column);
    this.removeColumn(column);
    repositionAllColumns(this.stateManager);
  }

  // private

  removeAllCards(column) {
    const cardRemovedEventHandler = new CardRemovedEventHandler();
    const cardsRepo = new CardsRepository(this.stateManager);

    cardsRepo.cardsByColumn(column.id).forEach((card) => {
      const proxyEvent = cardRemovedEvent('proxyRequester', card.id);
      cardRemovedEventHandler.execute({
        stateManager: this.stateManager,
        event: proxyEvent,
      });
    });
  }

  removeColumn(column) {
    this.stateManager.removeObject('columns', column.id);
  }
}
