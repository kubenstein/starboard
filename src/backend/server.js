/* eslint-disable no-multi-spaces */

import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import EventStorage from 'lib/git-event-storage.js';
import StoreAttachmentUsecase from 'lib/store-attachment-usecase.js';
import NullLogger from 'lib/null-logger.js';


// ---------------- config ----------------
const env = process.env;

const serverPort                = env.PORT || 8081;
const remoteRepoUrl             = env.REPO_URL;
const remoteRepoPollingInterval = env.POLLING_INTERVAL || 30;
const logger                    = env.DEBUG ? console : new NullLogger();
const tempDir                   = env.TEMP_DIR || '.tmp';
const tempUploadsDir            = env.TEMP_UPLOADS_DIR || `${tempDir}/tmpUploads/`;
const tempRepoDir               = env.TEMP_REPO_DIR || `${tempDir}/tmpRepo/`;

// ---------------- banner ----------------
// eslint-disable-next-line no-console
console.log(`
|
| Starting Starboard...
| Source repo set to: ${remoteRepoUrl}
|
| Board available at: http://localhost:${serverPort}/
|
`);

// ------------- serv setup ---------------
const app    = express();
const server = app.listen(serverPort);
const io     = SocketIo(server);
const upload = multer({ dest: tempUploadsDir });

app.use(express.static('frontend/'));

const eventStorage = new EventStorage({
  remoteRepoUrl: remoteRepoUrl,
  pathToTempLocalRepo: tempRepoDir,
  pollingIntervalInSeconds: remoteRepoPollingInterval,
  logger: logger
});

const storeAttachmentUsecase = new StoreAttachmentUsecase(eventStorage, {
  pathToStorage: tempRepoDir
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
eventStorage.addObserver(allClientsNotifier);


// ----------------- http -----------------
app.get('/attachments/:fileName', (req, res) => {
  res.sendFile(req.params.fileName, {
    dotfiles: 'deny',
    root: tempRepoDir,
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
    eventStorage.addEvent(event);
  });

  socket.on('getAllPastEvents', (sendBack) => {
    eventStorage.getAllPastEvents().then((events) => {
      sendBack(events);
    });
  });
});
