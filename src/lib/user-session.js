import axios from 'axios';
import BrowserSettings from './browser-settings';

export default class UserSession {
  constructor() {
    this.browserSettings = new BrowserSettings();
  }

  isLoggedIn() {
    return (this.userId() !== undefined);
  }

  userId() {
    return this.browserSettings.cookie('userId');
  }

  token() {
    return this.browserSettings.cookie('token');
  }

  login(email, password) {
    return axios.post('/login/', { email: email, password: password })
    .then((response) => {
      const r = response.data;
      this.browserSettings
      .setCookie('userId', r.userId)
      .setCookie('token', r.token);
    });
  }

  logout() {
    this.browserSettings
    .setCookie('userId', undefined)
    .setCookie('token', undefined);
  }
}
