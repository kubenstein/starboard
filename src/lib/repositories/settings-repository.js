import { settingsUpdatedEvent } from 'lib/event-definitions';

export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  availableColorSpecs() {
    return {
      '#00E6FF': { name: 'cyan', isDark: false },
      '#3CB500': { name: 'green', isDark: true },
      '#FAD900': { name: 'yellow', isDark: false },
      '#FF9F19': { name: 'orange', isDark: false },
      '#EB4646': { name: 'red', isDark: true },
      '#A632DB': { name: 'purple', isDark: true },
      '#0079BF': { name: 'blue', isDark: true },
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

  textForLabel(color, withNamedDefault = false) {
    const key = `label-${color}`;
    let defaultText = '';
    if (withNamedDefault) {
      defaultText = this.availableColorSpecs()[color].name;
    }
    return this.get(key, defaultText);
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
