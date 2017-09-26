import { settingsUpdatedEventType } from 'lib/event-definitions';

export default class SettingsUpdated {
  forEvent() { return settingsUpdatedEventType; }

  execute({ stateManager, event }) {
    const data = event.data;
    const settings = stateManager.objectData('settings', data.id);
    if (settings) {
      stateManager.removeObject('settings', data.id);
    }

    if (data.value) {
      stateManager.addObject('settings', event.data);
    }
  }
}
