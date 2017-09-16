import { cardUpdatedEventType } from '../event-definitions.js';
import repositionAllCards from './support/reposition-all-cards.js';

export default class CardUpdated {
  static forEvent() { return cardUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const { cardId, changes } = event.data;
    let newPosition = changes.position;
    let newColumnId = changes.columnId;

    const cardOldData = this.currentState.objectData('cards', cardId);
    if (!cardOldData) return;

    if (newPosition !== undefined || newColumnId !== undefined) {
      newPosition = (newPosition !== undefined) ? newPosition : cardOldData.position;
      newColumnId = (newColumnId !== undefined) ? newColumnId : cardOldData.columnId;

      this.updatePositionOfOtherCards(cardId, {
        oldPosition: cardOldData.position,
        newPosition: newPosition,
        oldColumnId: cardOldData.columnId,
        newColumnId: newColumnId
      });
    }

    this.currentState.updateObject('cards', cardId, changes);
  }

  // private

  updatePositionOfOtherCards(movedCardId, params) {
    const { oldPosition, newPosition, oldColumnId, newColumnId } = params;

    const cards = this.currentState.bucket('cards')
                                   .filter(c => c.columnId === newColumnId &&
                                                c.id !== movedCardId);

    if (newColumnId === oldColumnId) {
      //
      // Move a card within same column
      if (newPosition < oldPosition) {
        // Moving a card up
        // All cards after movedCardId's newPosition: update position +1
        cards.forEach((c) => {
          if (c.position >= newPosition && c.position < oldPosition) {
            this.currentState.updateObject('cards', c.id, { position: c.position + 1 });
          }
        });
      } else {
        // Moving a card down
        // All cards before movedCardId's newPosition: update position -1
        cards.forEach((c) => {
          if (c.position <= newPosition && c.position > oldPosition) {
            this.currentState.updateObject('cards', c.id, { position: c.position - 1 });
          }
        });
      }
    } else {
      //
      // Move a card to a different column
      // All cards in a new column, after movedCardId's newPosition: update position +1
      cards.forEach((c) => {
        if (c.position >= newPosition) {
          this.currentState.updateObject('cards', c.id, { position: c.position + 1 });
        }
      });

      // All cards in an old column, update like the moved card was removed
      repositionAllCards(
        this.currentState,
        oldColumnId
      );
    }
  }
}
