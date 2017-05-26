import { cardLabelUpdatedEventType } from '../event-definitions.js';

export default class CardLabelUpdated {
  static forEvent() { return cardLabelUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const cardId = event.data.cardId;
    const label = event.data.label;
    const shouldBeSet = event.data.set;
    const card = this.currentState.objectData('cards', cardId);
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
