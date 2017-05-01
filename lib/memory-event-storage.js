class MemoryEventStorage {
  constructor(params = {}) {
    this.logger = params.logger || { log: () => {} };
    this.events = [];
    this.observers = [];
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

  getAllPastEvents() {
    return new Promise((resolve, _reject) => {
      resolve(this.events);
    });
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}

module.exports = MemoryEventStorage;
