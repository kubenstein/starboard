import { fileAddedEvent } from './event-definitions.js';
import { hasToBeSet } from './utils.js';

export default class MemoryEventStorage {
  constructor(params = {}) {
    this.addFileHandler = params.addFileHandler || hasToBeSet('addFileHandler');
    this.logger = params.logger || { log: () => {} };
    this.events = [];
    this.observers = [];
  }

  welcomeInfo() {
    return 'Using Memory Storage';
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.events.push(event);
      this.notify(event);
      this.logger.log(event);
      resolve();
    });
  }

  addFile(fileBlobOrFilePath) {
    return this.addFileHandler(fileBlobOrFilePath)
    .then((fileUrl) => {
      const event = fileAddedEvent('MemoryEventRequester', fileUrl);
      return this.addEvent(event)
      .then(() => { return fileUrl; });
    });
  }

  removeFile(_fileName) {
    // Do nothing... Files are stored directly in url (as base64)
  }

  allPastEvents() {
    return Promise.resolve(this.events);
  }

  purge() {
    this.events = [];
    return Promise.resolve();
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
