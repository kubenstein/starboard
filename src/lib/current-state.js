import SettingsUpdatedEventHandler from './eventHandlers/settings-updated.js';
import ColumnAddedEventHandler from './eventHandlers/column-added.js';
import ColumnUpdatedEventHandler from './eventHandlers/column-updated.js';
import ColumnRemovedEventHandler from './eventHandlers/column-removed.js';
import CardAddedEventHandler from './eventHandlers/card-added.js';
import CardUpdatedEventHandler from './eventHandlers/card-updated.js';
import CardRemovedEventHandler from './eventHandlers/card-removed.js';
import CardLabelUpdatedEventHandler from './eventHandlers/card-label-updated.js';
import CommentAddedEventHandler from './eventHandlers/comment-added.js';
import CommentRemovedEventHandler from './eventHandlers/comment-removed.js';
import UserUpdatedEventHandler from './eventHandlers/user-updated.js';
import AllEventsEventHandler from './eventHandlers/all-events.js';

export default class CurrentState {
  constructor(params) {
    this.eventStorage = params.eventSource;
    this.userId = params.userId;
    this.observers = [];
    this.data = {};
    this.eventHandlers = {};

    this.registerEventHandlers([
      AllEventsEventHandler,
      SettingsUpdatedEventHandler,
      ColumnAddedEventHandler,
      ColumnUpdatedEventHandler,
      ColumnRemovedEventHandler,
      CardAddedEventHandler,
      CardUpdatedEventHandler,
      CardRemovedEventHandler,
      CardLabelUpdatedEventHandler,
      CommentAddedEventHandler,
      CommentRemovedEventHandler,
      UserUpdatedEventHandler
    ]);

    this.eventStorage.addObserver(this);
    this.processAllPastEvents();
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  purge() {
    return this.eventStorage.purge().then(() => {
      this.data = {};
      this.onDataSynced();
    });
  }

  addEvent(event) {
    return this.eventStorage.addEvent(event);
  }

  addFile(attr) {
    return this.eventStorage.addFile(attr);
  }

  removeFile(fileName) {
    return this.eventStorage.removeFile(fileName);
  }

  getUserId() {
    return this.userId;
  }

  bucket(bucketName) {
    if (!this.data[bucketName]) {
      this.data[bucketName] = [];
    }
    return this.data[bucketName]
           .slice(0);
  }

  // Event handlers helpers

  addObject(bucketName, object) {
    if (!this.data[bucketName]) {
      this.data[bucketName] = [];
    }
    this.data[bucketName].push(object);
  }

  updateObject(bucketName, objectId, changes) {
    const objectIndex = this.bucket(bucketName).findIndex(object => object.id === objectId);
    if (objectIndex < 0) return;

    const oldData = this.bucket(bucketName)[objectIndex];
    const updatedData = Object.assign(oldData, changes);
    this.data[bucketName][objectIndex] = updatedData;
  }

  removeObject(bucketName, objectId) {
    const objectIndex = this.bucket(bucketName).findIndex(object => object.id === objectId);
    if (objectIndex < 0) return;

    this.data[bucketName].splice(objectIndex, 1);
  }

  objectData(bucketName, objectId) {
    const objectIndex = this.bucket(bucketName).findIndex(object => object.id === objectId);
    return this.bucket(bucketName)[objectIndex];
  }

  // private

  onDataSynced() {
    this.observers.forEach((observer) => {
      observer.onStateUpdate();
    });
  }

  processAllPastEvents() {
    this.eventStorage.allPastEvents().then((events) => {
      events.forEach((event) => {
        this.onNewEvent(event, false);
      });
      this.onDataSynced();
    });
  }

  registerEventHandlers(arrayOfeventHandlerClasses) {
    arrayOfeventHandlerClasses.forEach((eh) => {
      this.eventHandlers[eh.forEvent()] = eh;
    });
  }

  //
  // eventSource callback
  onNewEvent(event, notifyObservers = true) {
    const handlerName = event.type;
    const EventHandler = this.eventHandlers[handlerName];
    const AllEventsHandler = this.eventHandlers.allEventTypes;

    if (EventHandler) {
      new EventHandler(this).execute(event);

      if (AllEventsHandler) {
        new AllEventsHandler(this).execute(event);
      }

      if (notifyObservers) {
        this.onDataSynced();
      }
    }
  }
}
