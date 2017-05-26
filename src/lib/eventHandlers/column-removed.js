import CardRemovedEventHandler from './card-removed.js';
import updatePositionOfOtherColumnsAfterColumnRemoval
  from './support/update-position-of-other-columns-after-column-removal.js';

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
    const columnId = event.data.columnId;
    const column = this.currentState.objectData('columns', columnId);
    this.removeAllCards(column);
    this.repositionAllOtherColumns(column);
    this.removeColumn(column);
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

  repositionAllOtherColumns(column) {
    updatePositionOfOtherColumnsAfterColumnRemoval(
      this.currentState,
      column.position
    );
  }
}
