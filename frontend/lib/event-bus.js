export default class EventBus {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      //
      // TODO: Persist here...
      //
      this.notify(event);
      resolve();
    });
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
