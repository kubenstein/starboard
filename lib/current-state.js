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
    const card = this.data.cards.filter(c => c.id === cardId)[0];

    const cardIndex = this.data.cards.findIndex(c => c.id === cardId);
    this.data.cards.splice(cardIndex, 1);

    this.updatePositionOfOtherCardsAfterCardRemoval(card.columnId, card.position);

    this.bucket('comments').forEach((comment, commentIndex) => {
      if (comment.cardId === cardId) {
        this.data.comments.splice(commentIndex, 1);
      }
    });
  }

  columnUpdatedEventHandler(event) {
    const columnId = event.data.columnId;
    const changes = event.data.changes;
    const newPosition = changes.position;

    if (newPosition !== undefined) {
      const oldPosition = this.objectData('columns', columnId).position;
      this.updatePositionOfOtherColumns(columnId, oldPosition, newPosition);
    }

    this.updateObject('columns', columnId, changes);
  }

  cardUpdatedEventHandler(event) {
    const cardId = event.data.cardId;
    const changes = event.data.changes;
    let newPosition = changes.position;
    let newColumnId = changes.columnId;

    if (newPosition !== undefined || newColumnId !== undefined) {
      const oldData = this.objectData('cards', cardId);
      newPosition = (newPosition !== undefined) ? newPosition : oldData.position;
      newColumnId = (newColumnId !== undefined) ? newColumnId : oldData.columnId;

      this.updatePositionOfOtherCards(cardId, {
        oldPosition: oldData.position,
        newPosition: newPosition,
        oldColumnId: oldData.columnId,
        newColumnId: newColumnId
      });
    }

    this.updateObject('cards', cardId, changes);
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

  // support

  updatePositionOfOtherColumns(movedColumnId, oldPosition, newPosition) {
    const columns = this.bucket('columns')
                    .filter(c => c.id !== movedColumnId);

    if (newPosition < oldPosition) {
      // moving to left
      // all after movedColumnId's newPosition: update position +1
      columns.forEach((c) => {
        if (c.position >= newPosition && c.position < oldPosition) {
          this.updateObject('columns', c.id, { position: c.position + 1 });
        }
      });
    } else {
      // moving to right
      // all before movedColumnId's newPosition: update position -1
      columns.forEach((c) => {
        if (c.position <= newPosition && c.position > oldPosition) {
          this.updateObject('columns', c.id, { position: c.position - 1 });
        }
      });
    }
  }


  updatePositionOfOtherCards(movedCardId, params) {
    const { oldPosition, newPosition, oldColumnId, newColumnId } = params;

    const cards = this.bucket('cards')
                      .filter(c => c.columnId === newColumnId &&
                                   c.id !== movedCardId);

    if (newColumnId === oldColumnId) {
      //
      // move within same column
      if (newPosition < oldPosition) {
        // moving to top
        // all after movedCardId's newPosition: update position +1
        cards.forEach((c) => {
          if (c.position >= newPosition && c.position < oldPosition) {
            this.updateObject('cards', c.id, { position: c.position + 1 });
          }
        });
      } else {
        // moving to bottom
        // all before movedCardId's newPosition: update position -1
        cards.forEach((c) => {
          if (c.position <= newPosition && c.position > oldPosition) {
            this.updateObject('cards', c.id, { position: c.position - 1 });
          }
        });
      }
    } else {
      //
      // move to different column
      // all after movedCardId's newPosition: update position +1
      cards.forEach((c) => {
        if (c.position >= newPosition) {
          this.updateObject('cards', c.id, { position: c.position + 1 });
        }
      });

      this.updatePositionOfOtherCardsAfterCardRemoval(oldColumnId, oldPosition);
    }
  }

  updatePositionOfOtherCardsAfterCardRemoval(removedCardColumnId, removedCardPosition) {
    const cards = this.bucket('cards')
                      .filter(c => c.columnId === removedCardColumnId);
    cards.forEach((c) => {
      if (c.position > removedCardPosition) {
        this.updateObject('cards', c.id, { position: c.position - 1 });
      }
    });
  }


  updateObject(bucketName, objectId, changes) {
    const objectIndex = this.data[bucketName].findIndex(object => object.id === objectId);
    const oldData = this.data[bucketName][objectIndex];
    const updatedData = Object.assign(oldData, changes);
    this.data[bucketName][objectIndex] = updatedData;
  }

  objectData(bucketName, objectId) {
    const objectIndex = this.data[bucketName].findIndex(object => object.id === objectId);
    return this.data[bucketName][objectIndex];
  }
}
