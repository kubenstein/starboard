import express from 'express';
import SocketIo from 'socket.io';
import EventStorage from '../lib/git-event-storage.js';

// ------------- serv setup ---------------
const app = express();
const server = app.listen(process.env.PORT || 8081);
const io = SocketIo(server);
app.use(express.static('frontend/'));

const attachmentStorage = '.tmp/tmpRepo/';
const eventStotage = new EventStorage({
  pathToRepo: process.env.PATH_TO_REPO,
  tempLocation: attachmentStorage,
  pollingIntervalInSeconds: 10,
  logger: console
});


// ----------------- utils ----------------
const sockets = [];
const allClientsNotifier = {
  onNewEvent: (newEvent) => {
    sockets.forEach((socket) => {
      socket.emit('newEvent', newEvent);
    });
  }
};
eventStotage.addObserver(allClientsNotifier);

// ----------------- http -----------------

app.get('/attachments/:fileName', (req, res) => {
  res.sendFile(req.params.fileName, {
    dotfiles: 'deny',
    root: attachmentStorage,
  });
});

// -------------- webSockets --------------
io.on('connection', (socket) => {
  sockets.push(socket);
  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });

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
