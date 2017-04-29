export default class MemoryEventStorage {
  constructor() {
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
