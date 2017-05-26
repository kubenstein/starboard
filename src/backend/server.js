/* eslint-disable no-multi-spaces */

import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import EventStorage from 'lib/git-event-storage.js';
import StoreFileUsecase from 'lib/store-file-usecase.js';
import CleanFilesUsecase from 'lib/clean-files-usecase.js';
import CurrentState from 'lib/current-state.js';
import NullLogger from 'lib/null-logger.js';


// ---------------- config ----------------
const env = process.env;

const serverPort                = env.PORT || 8081;
const remoteRepoUrl             = env.REPO_URL || (() => { throw new Error('REPO_URL env has to be set'); })();
const pathToSshPrivateKey       = env.SSH_KEY_PATH || '';
const repoCommiterName          = env.REPO_COMMITER_NAME || 'Starboard BOT';
const repoCommiterEmail         = env.REPO_COMMITER_EMAIL || 'starboardbot@localhost';
const remoteRepoSyncingInterval = env.SYNCING_INTERVAL || 30;
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

app.use(express.static(`${__dirname}/frontend/`));

const eventStorage = new EventStorage({
  remoteRepoUrl: remoteRepoUrl,
  pathToSshPrivateKey: pathToSshPrivateKey,
  pathToTempLocalRepo: tempRepoDir,
  commiterEmail: repoCommiterEmail,
  commiterUsername: repoCommiterName,
  syncingIntervalInSeconds: remoteRepoSyncingInterval,
  logger: logger
});

const currentState = new CurrentState({ eventSource: eventStorage });

const storeFileUsecase = new StoreFileUsecase(currentState, {
  pathToStorage: tempRepoDir
});

const cleanFilesUsecase = new CleanFilesUsecase(currentState, {
  pathToStorage: tempRepoDir,
  fileNamePrefix: '/attachments/'
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
  storeFileUsecase.addFile(req.file).then((fileName) => {
    res.send({ attachmentUrl: `/attachments/${fileName}` });
  });
});


// -------------- webSockets --------------
io.on('connection', (socket) => {
  sockets.push(socket);
  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });

  socket.on('addEvent', (event, sendBack) => {
    cleanFilesUsecase.cleanWhenNeeded(event);
    sendBack(event);
    eventStorage.addEvent(event);
  });

  socket.on('getAllPastEvents', (sendBack) => {
    eventStorage.allPastEvents().then((events) => {
      sendBack(events);
    });
  });
});
