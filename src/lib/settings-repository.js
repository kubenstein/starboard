import { settingsUpdatedEvent } from './event-definitions.js';

export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  availableColorSpecs() {
    return {
      '#00E6FF': { isDark: false },
      '#3CB500': { isDark: true },
      '#FAD900': { isDark: false },
      '#FF9F19': { isDark: false },
      '#EB4646': { isDark: true },
      '#A632DB': { isDark: true },
      '#0079BF': { isDark: true }
    };
  }

  availableColors() {
    return Object.keys(this.availableColorSpecs());
  }

  isThemeColorDark() {
    const color = this.themeColor();
    return this.availableColorSpecs()[color].isDark;
  }

  themeColor() {
    return this.get('themeColor', '#3CB500');
  }

  setThemeColor(hexColor) {
    return this.set('themeColor', hexColor);
  }

  boardName() {
    return this.get('boardName', '');
  }

  setBoardName(name) {
    return this.set('boardName', name);
  }

  textForLabel(color) {
    const key = `label-${color}`;
    return this.get(key, '');
  }

  setTextForLabel(color, value) {
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
    const requesterId = this.stateManager.getUserId();
    const event = settingsUpdatedEvent(requesterId, key, value);
    return this.stateManager.addEvent(event);
  }
}
