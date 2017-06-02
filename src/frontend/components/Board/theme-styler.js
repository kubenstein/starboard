import SettingsRepository from 'lib/settings-repository.js';
import BrowserSettings from 'lib/browser-settings.js';

export default class ThemeStyler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.browserSettings = new BrowserSettings();
  }

  generateStyle() {
    const themeColor = this.settingsRepo.themeColor();
    if (!themeColor) return '';
    this.browserSettings.setFavicon(themeColor);
    return `
      .btn-success, .board {
        background-color: ${themeColor};
      }
    `;
  }
}
