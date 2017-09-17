import UserSessionService from 'lib/user-session-service';
import BrowserSettingsService from 'lib/browser-settings-service';

export default class UserLogoutUsecase {
  logout() {
    new UserSessionService().logout();
    new BrowserSettingsService().reloadPage();
  }
}
