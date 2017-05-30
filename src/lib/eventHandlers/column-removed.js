import CardRemovedEventHandler from './card-removed.js';
import repositionAllColumns from './support/reposition-all-columns.js';
import {
  columnRemovedEventType,
  cardRemovedEvent
} from '../event-definitions.js';

export default class ColumnRemoved {
  static forEvent() { return columnRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const column = this.currentState.objectData('columns', event.data.columnId);
    this.removeAllCards(column);
    this.removeColumn(column);
    repositionAllColumns(this.currentState);
  }

  // private

  removeAllCards(column) {
    const cardRemovedEventHandler = new CardRemovedEventHandler(this.currentState);
    this.currentState.bucket('cards').forEach((card) => {
      if (card.columnId === column.id) {
        const proxyEvent = cardRemovedEvent(card.id);
        cardRemovedEventHandler.execute(proxyEvent);
      }
    });
  }

  removeColumn(column) {
    this.currentState.removeObject('columns', column.id);
  }
}
