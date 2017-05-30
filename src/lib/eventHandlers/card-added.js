import updatePositionsOfCards from './support/update-positions-of-other-cards.js';
import { cardAddedEventType } from '../event-definitions.js';

export default class CardAdded {
  static forEvent() { return cardAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = event.data;
    this.currentState.bucket('cards').push(card);
    updatePositionsOfCards(this.currentState, card.columnId);
  }
}
