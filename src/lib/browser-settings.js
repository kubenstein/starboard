import { currentTimestamp } from './utils.js';

export default class BrowserSettings {
  setUrlForCard(card) {
    window.location = `#/card/${card.id}`;
  }

  urlCardId() {
    return window.location.hash
          .split('/')
          .reverse()[0];
  }

  setMainUrl() {
    window.location = '#';
  }

  setTitle(title) {
    document.title = title;
  }

  setFavicon(color) {
    const id = color.replace('#', '');
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = `/favicons/favicon_${id}.png?refresher=${currentTimestamp()}`;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
