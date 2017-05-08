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
    const cammelcasedEventName = event.type
                                     .toLowerCase()
                                     .replace(/_([a-z])/g, (g) => { return g[1].toUpperCase(); });
    const handlerName = `${cammelcasedEventName}EventHandler`;
    if (this[handlerName]) {
      this[handlerName](event);
      this.onDataSynced();
    }
  }

  // Event Handlers

  removeCommentEventHandler(event) {
    const commentId = event.data.commentId;
    const commentIndex = this.data.comments.findIndex(comment => comment.id === commentId);
    this.data.comments.splice(commentIndex, 1);
  }

  updateColumnEventHandler(event) {
    const columnId = event.data.columnId;
    this.updateObject('columns', columnId, event.data.changes);
  }

  updateCardEventHandler(event) {
    const cardId = event.data.cardId;
    this.updateObject('cards', cardId, event.data.changes);
  }

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

  updateObject(bucketName, objectId, changes) {
    const objectIndex = this.data[bucketName].findIndex(object => object.id === objectId);
    const oldData = this.data[bucketName][objectIndex];
    const updatedData = Object.assign(oldData, changes);
    this.data[bucketName][objectIndex] = updatedData;
  }
}
