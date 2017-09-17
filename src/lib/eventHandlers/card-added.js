import { cardAddedEventType } from 'lib/event-definitions';
import repositionAllCards from './support/reposition-all-cards';

export default class CardAdded {
  static forEvent() { return cardAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const card = event.data;
    const column = this.currentState.objectData('columns', card.columnId);
    if (!column) return;

    this.currentState.addObject('cards', card);
    repositionAllCards(this.currentState, card.columnId);
  }
}
