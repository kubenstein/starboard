import io from 'socket.io-client';

export default class ServerEventStorage {
  constructor() {
    this.observers = [];
    this.socket = io();
    this.socket.on('newEvents', (events) => { this.onNewEventsFromServer(events); });
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.socket.emit('addEvent', event, () => {
        this.notify(event);
        resolve();
      });
    });
  }

  getAllPastEvents() {
    return new Promise((resolve, _reject) => {
      this.socket.emit('getAllPastEvents', resolve);
    });
  }

  onNewEventsFromServer(events) {
    events.forEach((event) => {
      this.notify(event);
    });
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
