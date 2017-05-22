import { settingsUpdatedEventType } from '../event-definitions.js';

export default class ColumnAdded {
  static forEvent() { return settingsUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    this.currentState.bucket('settings').push(event.data);
  }
}
