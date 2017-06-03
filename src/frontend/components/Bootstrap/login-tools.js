import BrowserSettings from 'lib/browser-settings.js';

export function alreadyLoggedIn() {
  const data = loginData();
  return (data.username && data.email);
}

export function storeLoginData(username, email) {
  const bs = new BrowserSettings();
  bs.setCookie('username', username)
    .setCookie('email', email);
}

export function loginData() {
  const bs = new BrowserSettings();
  return {
    username: bs.cookie('username'),
    email: bs.cookie('email')
  };
}
