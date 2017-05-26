import SettingsRepository from 'lib/settings-repository.js';

export default class ThemeStyler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.repo = new SettingsRepository(this.stateManager);
  }

  generateCss() {
    const themeColor = this.repo.themeColor();
    if (!themeColor) return '';
    return `
      .btn-success, .board {
        background-color: ${themeColor};
      }
    `;
  }
}
