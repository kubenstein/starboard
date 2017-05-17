export default class CurrentState {
  constructor(params) {
    this.eventStorage = params.eventSource;
    this.observers = [];
    this.data = {};

    this.eventStorage.addObserver(this);
    this.processAllPastEvents();
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  bucket(name) {
    return this.data[name] || [];
  }

  addEvent(event) {
    return this.eventStorage.addEvent(event);
  }

  addFile(fileBlob) {
    return this.eventStorage.addFile(fileBlob);
  }

  // private

  onDataSynced() {
    this.observers.forEach((observer) => {
      observer.onStateUpdate();
    });
  }

  processAllPastEvents() {
    this.eventStorage.getAllPastEvents().then((events) => {
      events.forEach((event) => {
        this.onNewEvent(event, false);
      });
      this.onDataSynced();
    });
  }

  //
  // eventSource callback

  onNewEvent(event, notifyObservers = true) {
    const cammelcasedEventName = event.type
                                 .toLowerCase()
                                 .replace(/_([a-z])/g, (g) => { return g[1].toUpperCase(); });
    const handlerName = `${cammelcasedEventName}EventHandler`;
    if (this[handlerName]) {
      this[handlerName](event);

      if (notifyObservers) {
        this.onDataSynced();
      }
    }
  }

  // Event Handlers

  commentRemovedEventHandler(event) {
    const commentId = event.data.commentId;
    const commentIndex = this.data.comments.findIndex(comment => comment.id === commentId);
    this.data.comments.splice(commentIndex, 1);
  }

  cardRemovedEventHandler(event) {
    const cardId = event.data.cardId;
    const cardIndex = this.data.cards.findIndex(card => card.id === cardId);
    this.data.cards.splice(cardIndex, 1);

    this.data.comments.forEach((comment, commentIndex) => {
      if (comment.cardId === cardId) {
        this.data.comments.splice(commentIndex, 1);
      }
    });
  }

  columnUpdatedEventHandler(event) {
    const columnId = event.data.columnId;
    this.updateObject('columns', columnId, event.data.changes);
  }

  cardUpdatedEventHandler(event) {
    const cardId = event.data.cardId;
    this.updateObject('cards', cardId, event.data.changes);
  }

  columnAddedEventHandler(event) {
    this.addDataToBucket('columns', event.data);
  }

  cardAddedEventHandler(event) {
    this.addDataToBucket('cards', event.data);
  }

  commentAddedEventHandler(event) {
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
