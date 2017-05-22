export default class SettingsRepository {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  getThemeColor() {
    const bucket = this.stateManager.bucket('settings');
    return bucket.filter(c => c.name === 'boardColor')[0];
  }
}
