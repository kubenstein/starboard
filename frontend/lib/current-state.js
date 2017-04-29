import EventBus from 'lib/event-bus.js';

export default class CurrentState {
  constructor(params) {
    const eventStorage = params.eventSource;

    this.observers = [];
    this.data = {};
    this.eventbus = new EventBus(eventStorage);
    this.eventbus.addObserver(this, true);
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  bucket(name) {
    return this.data[name] || [];
  }

  addEvent(event) {
    return this.eventbus.addEvent(event);
  }

  // private

  onDataSynced() {
    this.observers.forEach((observer) => {
      observer.onStateUpdate();
    });
  }

  //
  // eventbus callback
  onNewEvent(event) {
    const cammecasedEventName = event.type
                                     .toLowerCase()
                                     .replace(/_([a-z])/g, (g) => { return g[1].toUpperCase(); });
    const handlerName = `${cammecasedEventName}EventHandler`;
    if (this[handlerName]) {
      this[handlerName](event);
      this.onDataSynced();
    }
  }

  // Event Handlers

  addColumnEventHandler(event) {
    this.addDataToBucket('columns', event.data);
  }

  addCardEventHandler(event) {
    this.addDataToBucket('cards', event.data);
  }

  addCommentEventHandler(event) {
    this.addDataToBucket('comments', event.data);
  }

  addDataToBucket(bucketName, data) {
    if (!this.data[bucketName]) {
      this.data[bucketName] = [];
    }
    this.data[bucketName].push(data);
  }
}
