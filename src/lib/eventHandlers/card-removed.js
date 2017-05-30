import { cardRemovedEventType } from '../event-definitions.js';
import updatePositionsOfCards from './support/update-positions-of-other-cards.js';

export default class CardRemoved {
  static forEvent() { return cardRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = this.currentState.objectData('cards', event.data.cardId);
    this.removeComments(card);
    this.removeCard(card);
    this.repositionOtherCards(card);
  }

  // private

  removeComments(card) {
    const commentsBucket = this.currentState.bucket('comments');
    commentsBucket.forEach((comment, commentIndex) => {
      if (comment.cardId === card.id) {
        commentsBucket.splice(commentIndex, 1);
      }
    });
  }

  removeCard(card) {
    this.currentState.removeObject('cards', card.id);
  }

  repositionOtherCards(card) {
    updatePositionsOfCards(
      this.currentState,
      card.columnId
    );
  }
}
