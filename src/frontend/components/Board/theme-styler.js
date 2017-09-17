import SettingsRepository from 'lib/repositories/settings-repository';
import BrowserSettingsService from 'lib/services/browser-settings-service';

export default class ThemeStyler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.settingsRepo = new SettingsRepository(this.stateManager);
    this.browserSettingsService = new BrowserSettingsService();
  }

  generateStyles() {
    const themeColor = this.settingsRepo.themeColor();
    if (!themeColor) return '';
    this.browserSettingsService.setFavicon(themeColor);
    return `
      .btn-success, .board {
        background-color: ${themeColor};
      }
    `;
  }
}
