import { settingsUpdatedEvent } from 'lib/event-definitions';

export default class UiRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  get(key, defautValue) {
    const settings = this.stateManager.objectData('settings', key);
    const nullSettings = { value: defautValue };
    return (settings || nullSettings).value;
  }

  set(key, value) {
    const requesterId = 'StarboardFrontEndApp';
    const event = settingsUpdatedEvent(requesterId, key, value);
    return this.stateManager.addEvent(event);
  }
}
