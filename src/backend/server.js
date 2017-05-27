/* eslint-disable no-multi-spaces */

import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import EventStorage from 'lib/git-event-storage.js';
import StoreFileUsecase from 'lib/store-file-usecase.js';
import CleanFilesUsecase from 'lib/clean-files-usecase.js';
import CurrentState from 'lib/current-state.js';
import NullLogger from 'lib/null-logger.js';
import { hasToBeSet } from 'lib/utils.js';

export default class Server {
  constructor(params) {
    this.serverPort                = params.port                || 8081;
    this.remoteRepoUrl             = params.remoteRepoUrl       || hasToBeSet('remoteRepoUrl');
    this.pathToSshPrivateKey       = params.pathToSshPrivateKey || '';
    this.repoCommiterName          = params.repoCommiterName    || 'Starboard BOT';
    this.repoCommiterEmail         = params.repoCommiterEmail   || 'starboardbot@localhost';
    this.tempDir                   = params.tempDir             || '.tmp';
    this.tempUploadsDir            = params.tempUploadsDir      || `${this.tempDir}/tmpUploads/`;
    this.tempRepoDir               = params.tempRepoDir         || `${this.tempDir}/tmpRepo/`;
    this.logger                    = params.logger              || new NullLogger();
    this.remoteRepoSyncingInterval = params.remoteRepoSyncingInterval || 30;
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | Source repo set to: ${this.remoteRepoUrl}
    |
    | Board available at: http://localhost:${this.serverPort}/
    |
    `);
  }

  start() {
    this.displayBanner();

    const app    = express();
    const server = app.listen(this.serverPort);
    const io     = SocketIo(server);
    const upload = multer({ dest: this.tempUploadsDir });

    app.use(express.static(`${__dirname}/frontend/`));

    const eventStorage = new EventStorage({
      remoteRepoUrl: this.remoteRepoUrl,
      pathToSshPrivateKey: this.pathToSshPrivateKey,
      pathToTempLocalRepo: this.tempRepoDir,
      commiterEmail: this.repoCommiterEmail,
      commiterUsername: this.repoCommiterName,
      syncingIntervalInSeconds: this.remoteRepoSyncingInterval,
      logger: this.logger
    });

    const currentState = new CurrentState({ eventSource: eventStorage });

    const storeFileUsecase = new StoreFileUsecase(currentState, {
      pathToStorage: this.tempRepoDir
    });

    const cleanFilesUsecase = new CleanFilesUsecase(currentState, {
      pathToStorage: this.tempRepoDir,
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
        root: this.tempRepoDir,
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
  }
}
