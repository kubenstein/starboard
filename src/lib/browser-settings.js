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
}
