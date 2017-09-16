import UserSession from 'lib/user-session';
import BrowserSettings from 'lib/browser-settings';

export default class UserLogoutUsecase {
  logout() {
    new UserSession().logout();
    new BrowserSettings().reloadPage();
  }
}
