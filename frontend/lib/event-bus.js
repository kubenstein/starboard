export default class EventBus {
  constructor() {
    this.observers = [];
    this.eventStorage = undefined;
  }

  addObserver(observer, notifyObserverAboutAllPastEvents = false) {
    this.observers.push(observer);

    if (notifyObserverAboutAllPastEvents) {
      this.notifyObserverAboutAllPastEvents(observer);
    }
  }

  notify(event) {
    this.observers.forEach((observer) => {
      this.notifyObserver(observer, event);
    });
  }

  notifyObserver(observer, event) {
    observer.onNewEvent(event);
  }

  notifyObserverAboutAllPastEvents(observer) {
    this.eventStorage.emitAllPastEvents().then((events) => {
      events.forEach((event) => {
        this.notifyObserver(observer, event);
      });
    });
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
}
