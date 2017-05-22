import { settingsUpdatedEvent } from './event-definitions.js';

export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getThemeColor() {
    const bucket = this.stateManager.bucket('settings');
    const settings = bucket.filter(c => c.key === 'themeColor')[0];
    const nullSettings = { value: '' };
    return (settings || nullSettings).value;
  }

  setThemeColor(hexColor) {
    const event = settingsUpdatedEvent('themeColor', hexColor);
    return this.stateManager.addEvent(event);
  }
}
