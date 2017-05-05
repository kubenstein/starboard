import io from 'socket.io-client';

export default class ServerEventStorage {
  constructor() {
    this.observers = [];
    this.socket = io();
    this.socket.on('onNewEvent', (event) => { this.onNewEventFromServer(event); });
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.socket.emit('addEvent', event, resolve);
    });
  }

  getAllPastEvents() {
    return new Promise((resolve, _reject) => {
      this.socket.emit('getAllPastEvents', resolve);
    });
  }

  onNewEventFromServer(event) {
    this.notify(event);
  }

  // private

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
