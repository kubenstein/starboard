import axios from 'axios';
import io from 'socket.io-client';

export default class ServerEventStorage {
  constructor() {
    this.observers = [];
    this.addedEventIDs = []; // To have smooth adding flow,
                             // we notify on success add,
                             // and ignore that event comming back
                             // from server (via newEvent channel)
    this.socket = io();
    this.socket.on('newEvent', (event) => { this.onNewEventFromServer(event); });
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  addEvent(event) {
    return new Promise((resolve, _reject) => {
      this.addedEventIDs.push(event.id);
      this.socket.emit('addEvent', event, () => {
        this.notify(event);
        resolve();
      });
    });
  }

  addFile(fileBlob) {
    const data = new FormData();
    data.append('attachment', fileBlob);
    return axios.post('/attachments/', data)
    .then((response) => {
      return response.data.attachmentUrl;
    });
  }

  removeFile(_filePath) {
    // Do nothing... Server will clear attachments.
  }

  allPastEvents() {
    return new Promise((resolve, _reject) => {
      this.socket.emit('getAllPastEvents', resolve);
    });
  }

  // private

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
