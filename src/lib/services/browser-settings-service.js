import Cookies from 'js-cookie';
import { currentTimestamp } from 'lib/utils';

export default class BrowserSettingsService {
  setUrlForCard(cardId) {
    if (cardId) {
      window.location = `#/card/${cardId}`;
    } else {
      this.setMainUrl();
    }
  }

  urlCardId() {
    return window.location.hash
          .split('/')
          .reverse()[0];
  }

  setMainUrl() {
    window.location = '#';
  }

  reloadPage() {
    window.location = '/';
  }

  setTitle(title) {
    document.title = title;
  }

  setFavicon(color) {
    const id = color.replace('#', '');
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = `/images/favicon_${id}.png?refresher=${currentTimestamp()}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  cookie(name) {
    return Cookies.get(name);
  }

  setCookie(name, value) {
    if (value) {
      Cookies.set(name, value);
    } else {
      Cookies.remove(name);
    }
    return this;
  }

  registerKeyDownEvent(eventHandler) {
    window.addEventListener('keydown', eventHandler);
  }

  unregisterKeyDownEvent(eventHandler) {
    window.removeEventListener('keydown', eventHandler);
  }
}
