export default class CurrentState {
  constructor(params) {
    this.eventStorage = params.eventSource;
    this.observers = [];
    this.data = {};

    this.eventStorage.addObserver(this);
    this.getAllPastEvents();
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

  // private

  onDataSynced() {
    this.observers.forEach((observer) => {
      observer.onStateUpdate();
    });
  }

  getAllPastEvents() {
    this.eventStorage.getAllPastEvents().then((events) => {
      events.forEach((event) => {
        this.onNewEvent(event, false);
      });
      this.onDataSynced();
    });
  }

  //
  // eventSource callback

  onNewEvent(event, withObserversNotifying = true) {
    const cammelcasedEventName = event.type
                                 .toLowerCase()
                                 .replace(/_([a-z])/g, (g) => { return g[1].toUpperCase(); });
    const handlerName = `${cammelcasedEventName}EventHandler`;
    if (this[handlerName]) {
      this[handlerName](event);

      if (withObserversNotifying) {
        this.onDataSynced();
      }
    }
  }

  // Event Handlers

  removeCommentEventHandler(event) {
    const commentId = event.data.commentId;
    const commentIndex = this.data.comments.findIndex(comment => comment.id === commentId);
    this.data.comments.splice(commentIndex, 1);
  }

  removeCardEventHandler(event) {
    const cardId = event.data.cardId;
    const cardIndex = this.data.cards.findIndex(card => card.id === cardId);
    this.data.cards.splice(cardIndex, 1);

    this.data.comments.forEach((comment, commentIndex) => {
      if (comment.cardId === cardId) {
        this.data.comments.splice(commentIndex, 1);
      }
    });
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
