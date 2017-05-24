import { cardLabelToggledEventType } from '../event-definitions.js';

export default class CardLabelToggled {
  static forEvent() { return cardLabelToggledEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const cardId = event.data.cardId;
    const label = event.data.label;
    const card = this.currentState.objectData('cards', cardId);
    const labels = card.labels || [];
    const existedLabelIndex = labels.indexOf(label);

    if (existedLabelIndex === -1) {
      labels.push(label);
    } else {
      labels.splice(existedLabelIndex, 1);
    }
    this.currentState.updateObject('cards', cardId, { labels: labels });
  }
}
