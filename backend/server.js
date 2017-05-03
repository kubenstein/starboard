const express = require('express');
const SocketIo = require('socket.io');
const EventStorage = require('../lib/git-event-storage.js');

// ------------- serv setup ---------------
const app = express();
const server = app.listen(process.env.PORT || 8081);
const io = SocketIo(server);
const eventStotage = new EventStorage({
  pathToRepo: '/Users/Kuba/Desktop/test_repo',
  pollingIntervalInSeconds: 10
});

app.use(express.static('build/'));

// -------------- webSockets --------------
io.on('connection', (socket) => {
  const proxyObserver = {
    onNewEvent: (newEvent) => {
      socket.emit('newEvent', newEvent);
    }
  };
  eventStotage.addObserver(proxyObserver);


  socket.on('addEvent', (event, sendBack) => {
    sendBack(event);
    eventStotage.addEvent(event);
  });

  socket.on('getAllPastEvents', (sendBack) => {
    eventStotage.getAllPastEvents().then((events) => {
      sendBack(events);
    });
  });
});
