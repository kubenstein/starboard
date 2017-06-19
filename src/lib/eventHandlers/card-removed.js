import { cardRemovedEventType } from '../event-definitions.js';
import repositionAllCards from './support/reposition-all-cards.js';

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
    commentsBucket.forEach((comment) => {
      if (comment.cardId === card.id) {
        this.currentState.removeObject('comments', card.id);
      }
    });
  }

  removeCard(card) {
    this.currentState.removeObject('cards', card.id);
  }

  repositionOtherCards(card) {
    repositionAllCards(
      this.currentState,
      card.columnId
    );
  }
}
