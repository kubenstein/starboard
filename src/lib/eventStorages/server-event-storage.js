import io from 'socket.io-client';

export default class ServerEventStorage {
  constructor(params = {}) {
    const uri = params.uri || undefined; // same domain
    this.token = params.token;
    this.queue = Promise.resolve();
    this.observers = [];

    //
    // To have smooth adding flow,
    // we notify on success add,
    // and ignore that event comming back
    // from server (via newEvent channel)
    this.addedEventIDs = [];
    this.socket = io(uri, { query: `token=${this.token}` });

    this.start();
  }

  info() {
    return `Using SocketIO proxy Storage (${this.socket.io.uri})`;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.addedEventIDs.push(event.id);
      this.socket.emit('addEvent', event);
      this.notify(event);
      resolve();
    });
  }

  allPastEvents() {
    return new Promise((resolve, _reject) => {
      this.queue = this.queue.then(() => {
        this.socket.emit('getAllPastEvents', resolve);
      });
    });
  }

  // private

  start() {
    this.queue = this.queue.then(() => new Promise((resolve, _reject) => {
      this.socket.on('accessGranted', () => {
        this.startListeningForEvents();
        resolve();
      });
    }));
  }

  startListeningForEvents() {
    this.socket.on('newEvent', (event) => { this.onNewEventFromServer(event); });
  }

  onNewEventFromServer(event) {
    if (this.addedEventIDs.indexOf(event.id) === -1) {
      this.notify(event);
    }
  }

  notify(event) {
    this.observers.forEach((observer) => {
      observer.onNewEvent(event);
    });
  }
}
