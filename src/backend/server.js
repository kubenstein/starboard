/* eslint-disable no-multi-spaces */

import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import bodyParser from 'body-parser';
import uuid from 'uuid/v4';
import StoreFileUsecase from 'lib/store-file-usecase.js';
import CleanFilesUsecase from 'lib/clean-files-usecase.js';
import CurrentState from 'lib/current-state.js';
import NullLogger from 'lib/null-logger.js';
import { hasToBeSet } from 'lib/utils.js';

export default class Server {
  constructor(params) {
    this.eventStorage = params.eventStorage || hasToBeSet('eventStorage');
    this.serverPort   = params.port         || 8081;
    this.uploadsDir   = params.uploadsDir   || '.tmp/tmpUploads/';
    this.logger       = params.logger       || new NullLogger();
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | ${this.eventStorage.welcomeInfo()}
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
    const upload = multer({ dest: this.uploadsDir });

    app.use(express.static(`${__dirname}/frontend/`));
    app.use(bodyParser.json());

    const currentState = new CurrentState({ eventSource: this.eventStorage });

    const storeFileUsecase = new StoreFileUsecase(currentState, {
      storedFilesDir: this.uploadsDir
    });
    const cleanFilesUsecase = new CleanFilesUsecase(currentState, {
      pathToStorage: this.uploadsDir,
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
    this.eventStorage.addObserver(allClientsNotifier);


    // ----------------- http -----------------
    app.get('/attachments/:fileName', (req, res) => {
      res.sendFile(req.params.fileName, {
        dotfiles: 'deny',
        root: this.uploadsDir,
      });
    });

    app.post('/attachments/', upload.single('attachment'), (req, res) => {
      storeFileUsecase.addFile(req.file).then((fileName) => {
        res.send({ attachmentUrl: `/attachments/${fileName}` });
      });
    });

    app.post('/login/', (req, res) => {
      res.send({ userId: req.body.email, token: uuid() });
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
        this.eventStorage.addEvent(event);
      });

      socket.on('getAllPastEvents', (sendBack) => {
        this.eventStorage.allPastEvents().then((events) => {
          sendBack(events);
        });
      });
    });
  }
}
