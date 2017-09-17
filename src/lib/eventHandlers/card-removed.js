import CommentsRepository from 'lib/repositories/comments-repository';
import { cardRemovedEventType } from 'lib/event-definitions';
import repositionAllCards from './support/reposition-all-cards';

export default class CardRemoved {
  static forEvent() { return cardRemovedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = this.currentState.objectData('cards', event.data.cardId);
    if (!card) return;

    this.removeComments(card);
    this.removeCard(card);
    this.repositionOtherCards(card);
  }

  // private

  removeComments(card) {
    const commentsRepo = new CommentsRepository(this.currentState);
    commentsRepo.commentsForCard(card.id).forEach((comment) => {
      this.currentState.removeObject('comments', comment.id);
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
