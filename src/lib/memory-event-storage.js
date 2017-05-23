import { fileAddedEvent } from './event-definitions.js';

export default class MemoryEventStorage {
  constructor(params = {}) {
    this.logger = params.logger || { log: () => {} };
    this.events = [];
    this.observers = [];
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

  addFile(fileBlob) {
    return new Promise((resolve, _reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => { resolve(reader.result); }, false);
      reader.readAsDataURL(fileBlob);
    })
    .then((base64url) => {
      const event = fileAddedEvent(base64url);
      return this.addEvent(event)
      .then(() => {
        return base64url;
      });
    });
  }

  removeFile(_filePath) {
    // Do nothing... Files are stored directly in url to them (as base64)
  }

  getAllPastEvents() {
    return new Promise((resolve, _reject) => {
      resolve(this.events);
    });
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
