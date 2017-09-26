import { cardAddedEventType } from 'lib/event-definitions';
import repositionAllCards from './support/reposition-all-cards';

export default class CardAdded {
  forEvent() { return cardAddedEventType; }

  execute({ stateManager, event }) {
    const card = event.data;
    const column = stateManager.objectData('columns', card.columnId);
    if (!column) return;

    stateManager.addObject('cards', card);
    repositionAllCards(stateManager, card.columnId);
  }
}
