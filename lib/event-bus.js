export default class EventBus {
  constructor(eventStorage) {
    this.observers = [];
    this.eventStorage = eventStorage;
    this.eventStorage.addObserver(this);
  }

  addObserver(observer, notifyObserverAboutAllPastEvents = false) {
    if (notifyObserverAboutAllPastEvents) {
      this.notifyObserverAboutAllPastEvents(observer).then(() => {
        this.observers.push(observer);
      });
    } else {
      this.observers.push(observer);
    }
  }

  addEvent(event) {
    return this.eventStorage.addEvent(event);
  }

  //
  // eventStorage callback
  onNewEvent(event) {
    this.notify(event);
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
    return this.eventStorage.getAllPastEvents().then((events) => {
      events.forEach((event) => {
        this.notifyObserver(observer, event);
      });
    });
  }
}
