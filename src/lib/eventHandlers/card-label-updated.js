import { cardLabelUpdatedEventType } from 'lib/event-definitions';

export default class CardLabelUpdated {
  forEvent() { return cardLabelUpdatedEventType; }

  execute({ stateManager, event }) {
    const { cardId, label, set: shouldBeSet } = event.data;
    const card = stateManager.objectData('cards', cardId);
    if (!card) return;

    const labels = card.labels || [];

    if (shouldBeSet) {
      labels.push(label);
    } else {
      const existedLabelIndex = labels.indexOf(label);
      if (existedLabelIndex !== -1) {
        labels.splice(existedLabelIndex, 1);
      }
    }
    stateManager.updateObject('cards', cardId, { labels });
  }
}
