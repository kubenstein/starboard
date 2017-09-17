import UserSessionService from 'lib/user-session-service';
import BrowserSettings from 'lib/browser-settings';

export default class UserLogoutUsecase {
  logout() {
    new UserSessionService().logout();
    new BrowserSettings().reloadPage();
  }
}
