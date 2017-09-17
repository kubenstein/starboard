import { settingsUpdatedEventType } from 'lib/event-definitions';

export default class SettingsUpdated {
  static forEvent() { return settingsUpdatedEventType; }

  constructor(currentState) {
    this.currentState = currentState;
  }

  execute(event) {
    const data = event.data;
    const settings = this.currentState.objectData('settings', data.id);
    if (settings) {
      this.currentState.removeObject('settings', data.id);
    }

    if (data.value) {
      this.currentState.addObject('settings', event.data);
    }
  }
}
