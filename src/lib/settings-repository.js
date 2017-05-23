import { settingsUpdatedEvent } from './event-definitions.js';

export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  availableColors() {
    return [
      '#00e6ff', '#3CB500', '#FAD900', '#FF9F19', '#EB4646', '#A632DB', '#0079BF'
    ];
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

  getValueForLabel(color) {
    const key = `label-${color}`;
    return this.get(key, '');
  }

  setValueForLabel(color, value) {
    const key = `label-${color}`;
    return this.set(key, value);
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
