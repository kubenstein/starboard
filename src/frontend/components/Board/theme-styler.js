export default class ThemeStyler {
  constructor(deps) {
    this.settingsRepo = deps.get('settingsRepository');
    this.browserSettingsService = deps.get('browserSettingsService');
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
