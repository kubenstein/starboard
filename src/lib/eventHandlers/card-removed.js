import CommentsRepository from 'lib/repositories/comments-repository';
import { cardRemovedEventType } from 'lib/event-definitions';
import repositionAllCards from './support/reposition-all-cards';

export default class CardRemoved {
  forEvent() { return cardRemovedEventType; }


  execute({ stateManager, event }) {
    this.stateManager = stateManager;

    const card = this.stateManager.objectData('cards', event.data.cardId);
    if (!card) return;

    this.removeComments(card);
    this.removeCard(card);
    this.repositionOtherCards(card);
  }

  // private

  removeComments(card) {
    const commentsRepo = new CommentsRepository(this.stateManager);
    commentsRepo.commentsForCard(card.id).forEach((comment) => {
      this.stateManager.removeObject('comments', comment.id);
    });
  }

  removeCard(card) {
    this.stateManager.removeObject('cards', card.id);
  }

  repositionOtherCards(card) {
    repositionAllCards(
      this.stateManager,
      card.columnId,
    );
  }
}
