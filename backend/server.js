const express = require('express');
const SocketIo = require('socket.io');
const GitEventStorage = require('lib/git-event-storage.js');

// ------------- serv setup ---------------
const app = express();
const server = app.listen(process.env.PORT || 8081);
const io = SocketIo(server);
const storage = GitEventStorage();

app.use(express.static('build/'));

// -------------- webSockets --------------

io.on('connection', (socket) => {
  storage.onBackGroundUpdate((newEvents) => {
    socket.emit('newEvents', newEvents);
  });

  socket.on('addEvent', (event, sendBack) => {
    storage.addEvent(event).then(() => {
      sendBack(event);
    })
  });

  socket.on('getAllPastEvents', (sendBack) => {
    storage.getAllPastEvents().then((events) => {
      sendBack(events);
    });
  });
});
