import {
  cardLabelUpdatedEventType,
  cardAddedEventType,
  cardRemovedEventType,
  columnAddedEventType,
  columnRemovedEventType,
  commentAddedEventType,
  settingsUpdatedEventType
} from '../event-definitions.js';

export default class AllEvents {
  static forEvent() { return 'allEventTypes'; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const eventTypesToLog = [
      cardLabelUpdatedEventType,
      cardAddedEventType,
      cardRemovedEventType,
      columnAddedEventType,
      columnRemovedEventType,
      commentAddedEventType,
      settingsUpdatedEventType
    ];

    if (eventTypesToLog.indexOf(event.type) !== -1) {
      this.currentState.addObject('activities', event);
    }
  }
}
