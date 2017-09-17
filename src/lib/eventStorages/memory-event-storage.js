export default class MemoryEventStorage {
  constructor(params = {}) {
    this.logger = params.logger || { log: () => {} };
    this.events = [];
    this.observers = [];
  }

  welcomeInfo() {
    return 'Using Memory Storage';
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.events.push(event);
      this.notify(event);
      this.logger.log(event);
      resolve();
    });
  }

  allPastEvents() {
    return Promise.resolve(this.events);
  }

  purge() {
    this.events = [];
    return Promise.resolve();
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
