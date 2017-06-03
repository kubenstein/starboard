import BrowserSettings from 'lib/browser-settings.js';

export function alreadyLoggedIn() {
  return (loginEmail() !== undefined);
}

export function storeLoginEmail(email) {
  const bs = new BrowserSettings();
  bs.setCookie('email', email);
}

export function loginEmail() {
  const bs = new BrowserSettings();
  return bs.cookie('email');
}
