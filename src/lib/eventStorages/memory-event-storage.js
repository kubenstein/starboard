import NullLogger from 'lib/null-logger';

export default class MemoryEventStorage {
  constructor(params = {}) {
    this.logger = params.logger || new NullLogger();
    this.events = [];
    this.observers = [];
  }

  info() {
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

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
