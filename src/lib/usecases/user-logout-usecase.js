import UserSessionService from 'lib/services/user-session-service';
import BrowserSettingsService from 'lib/services/browser-settings-service';

export default class UserLogoutUsecase {
  logout() {
    new UserSessionService().logout();
    new BrowserSettingsService().reloadPage();
  }
}
