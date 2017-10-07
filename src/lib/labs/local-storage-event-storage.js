import NullLogger from 'lib/null-logger';

export default class LocalStorageEventStorage {
  constructor(params = {}) {
    this.logger = params.logger || new NullLogger();
    this.observers = [];
  }

  welcomeInfo() {
    return 'Using LocalStorage Storage';
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.addEventToLocalStorage(event);
      this.notify(event);
      this.logger.log(event);
      resolve();
    });
  }

  allPastEvents() {
    return Promise.resolve(this.readEvents());
  }

  purge() {
    this.saveEvents([]);
    return Promise.resolve();
  }

  // private

  readEvents() {
    const ls = window.localStorage;
    return JSON.parse(ls.getItem('events') || '[]');
  }

  saveEvents(events) {
    const ls = window.localStorage;
    ls.setItem('events', JSON.stringify(events));
  }

  addEventToLocalStorage(event) {
    const events = this.readEvents();
    events.push(event);
    this.saveEvents(events);
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
