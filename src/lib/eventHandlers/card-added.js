import { cardAddedEventType } from '../event-definitions.js';

export default class CardAdded {
  static forEvent() { return cardAddedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.bucket('cards').push(event.data);
  }
}
