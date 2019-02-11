import { cardAddedEventType } from 'lib/event-definitions';
import repositionAllCards from './support/reposition-all-cards';

export default class CardAdded {
  forEvent() { return cardAddedEventType; }

  execute({ stateManager, event }) {
    const card = event.data;
    const { columnId } = card;
    const column = stateManager.objectData('columns', columnId);
    if (!column) return;

    stateManager.addObject('cards', card);
    repositionAllCards(stateManager, columnId);
  }
}
