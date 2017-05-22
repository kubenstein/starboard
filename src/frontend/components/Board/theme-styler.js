import SettingsRepository from 'lib/settings-repository.js';

export default class ThemeStyler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  generateCss() {
    const themeColor = this.repo.getThemeColor();
    if (!themeColor) return '';
    return `
      .btn-success, .topbar {
        background-color: ${themeColor};
      }
    `;
  }
}
