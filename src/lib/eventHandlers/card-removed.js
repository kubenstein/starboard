import { cardRemovedEventType } from '../event-definitions.js';
import updatePositionOfOtherCardsAfterCardRemoval from './support/update-position-of-other-cards-after-card-removal.js';

export default class CardRemoved {
  static forEvent() { return cardRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = this.currentState.objectData('cards', event.data.cardId);
    this.repositionOtherCards(card);
    this.removeComments(card);
    this.removeCard(card);
  }

  // private

  repositionOtherCards(card) {
    updatePositionOfOtherCardsAfterCardRemoval(
      this.currentState,
      card.columnId,
      card.position
    );
  }

  removeComments(card) {
    const commentsBucket = this.currentState.bucket('comments');
    commentsBucket.forEach((comment, commentIndex) => {
      if (comment.cardId === card.Id) {
        commentsBucket.splice(commentIndex, 1);
      }
    });
  }

  removeCard(card) {
    this.currentState.removeObject('cards', card.Id);
  }
}
