import { settingsUpdatedEvent } from './event-definitions.js';

export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getThemeColor() {
    return this.get('themeColor', '');
  }

  setThemeColor(hexColor) {
    return this.set('themeColor', hexColor);
  }

  getBoardName() {
    return this.get('boardName', '');
  }

  setBoardName(name) {
    return this.set('boardName', name);
  }

  // private

  get(key, defautValue) {
    const settings = this.stateManager.objectData('settings', key);
    const nullSettings = { value: defautValue };
    return (settings || nullSettings).value;
  }

  set(key, value) {
    const event = settingsUpdatedEvent(key, value);
    return this.stateManager.addEvent(event);
  }
}
