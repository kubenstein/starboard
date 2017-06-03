import { settingsUpdatedEventType } from '../event-definitions.js';

export default class SettingsUpdated {
  static forEvent() { return settingsUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const data = event.data;
    const settings = this.currentState.objectData('settings', data.id);
    if (settings) {
      settings.value = data.value;
    } else {
      this.currentState.bucket('settings').push(event.data);
    }
  }
}
