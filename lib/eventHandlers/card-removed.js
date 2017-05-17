import { cardRemovedEventType } from '../event-definitions.js';
import updatePositionOfOtherCardsAfterCardRemoval from './support/update-position-of-other-cards-after-card-removal.js';

export default class CardRemoved {
  static forEvent() { return cardRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const cardId = event.data.cardId;
    const cardsBucket = this.currentState.bucket('cards');
    const commentsBucket = this.currentState.bucket('comments');

    const card = cardsBucket.filter(c => c.id === cardId)[0];

    const cardIndex = cardsBucket.findIndex(c => c.id === cardId);
    cardsBucket.splice(cardIndex, 1);

    updatePositionOfOtherCardsAfterCardRemoval(
      this.currentState,
      card.columnId,
      card.position
    );

    commentsBucket.forEach((comment, commentIndex) => {
      if (comment.cardId === cardId) {
        commentsBucket.splice(commentIndex, 1);
      }
    });
  }
}
