import { cardLabelUpdatedEventType } from '../event-definitions';

export default class CardLabelUpdated {
  static forEvent() { return cardLabelUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const { cardId, label, set: shouldBeSet } = event.data;
    const card = this.currentState.objectData('cards', cardId);
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
    this.currentState.updateObject('cards', cardId, { labels: labels });
  }
}
