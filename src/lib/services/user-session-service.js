import axios from 'axios';
import BrowserSettingsService from './browser-settings-service';

export default class UserSessionService {
  constructor() {
    this.browserSettingsService = new BrowserSettingsService();
  }

  isLoggedIn() {
    return (this.userId() !== undefined);
  }

  userId() {
    return this.browserSettingsService.cookie('userId');
  }

  token() {
    return this.browserSettingsService.cookie('token');
  }

  login(email, password) {
    return axios.post('/login/', { email: email, password: password })
    .then((response) => {
      const { userId, token } = response.data;
      this.browserSettingsService
      .setCookie('userId', userId)
      .setCookie('token', token);
    });
  }

  logout() {
    this.browserSettingsService
    .setCookie('userId', undefined)
    .setCookie('token', undefined);
  }
}
