import UserSession from 'lib/user-session.js';
import BrowserSettings from 'lib/browser-settings.js';

export default class UserLogoutUsecase {
  logout() {
    new UserSession().logout();
    new BrowserSettings().reloadPage();
  }
}
