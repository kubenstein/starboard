import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import EventStorage from '../lib/git-event-storage.js';
import StoreAttachmentUsecase from '../lib/store-attachment-usecase.js';

// ------------- serv setup ---------------
const app = express();
const server = app.listen(process.env.PORT || 8081);
const io = SocketIo(server);
const upload = multer({ dest: '.tmp/tempUploads/' });

app.use(express.static('frontend/'));

const gitAttachmentStorage = '.tmp/tmpRepo/';
const eventStotage = new EventStorage({
  pathToRepo: process.env.PATH_TO_REPO,
  pathToTempLocalRepo: gitAttachmentStorage,
  pollingIntervalInSeconds: 10,
  logger: console
});

const storeAttachmentUsecase = new StoreAttachmentUsecase(eventStotage, {
  pathToStorage: gitAttachmentStorage
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
    root: gitAttachmentStorage,
  });
});

app.post('/attachments/', upload.single('attachment'), (req, res) => {
  storeAttachmentUsecase.addFile(req.file).then((attachmentName) => {
    res.send({ attachmentUrl: `/attachments/${attachmentName}` });
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
