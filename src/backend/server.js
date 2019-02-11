/* eslint-disable no-multi-spaces */

import path from 'path';
import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import bodyParser from 'body-parser';
import StoreFileUsecase from 'lib/usecases/store-file-usecase';
import SendFileUsecase from 'lib/usecases/send-file-usecase';
import EventProcessorsQueue from 'lib/event-processors-queue';
import State from 'lib/state';
import AllowEveryoneAuth from 'lib/allow-everyone-auth';
import NullLogger from 'lib/null-logger';
import { hasToBeSet } from 'lib/utils';
import { permissionDeniedEvent } from 'lib/event-definitions';

export default class Server {
  constructor(params) {
    this.eventStorage    = params.eventStorage    || hasToBeSet('eventStorage');
    this.filesStorage    = params.filesStorage    || hasToBeSet('filesStorage');
    this.serverPort      = params.port            || 9000;
    this.uploadsDir      = params.uploadsDir      || path.resolve('.tmp/tmpUploads/');
    this.logger          = params.logger          || new NullLogger();
    this.auth            = params.auth            || new AllowEveryoneAuth();
    this.noBanner        = params.noBanner        || false;
    this.eventProcessors = params.eventProcessors || [];
    this.state           = params.state           || new State({ eventStorage: this.eventStorage });

    this.server           = null;
    this.sockets          = [];
    this.sendFileUsecase  = new SendFileUsecase({ filesStorage: this.filesStorage });
    this.storeFileUsecase = new StoreFileUsecase({
      filesStorage: this.filesStorage,
      eventStorage: this.eventStorage,
    });
    this.incommingEventProcessors = new EventProcessorsQueue({
      stateManager: this.state,
      processors: this.eventProcessors,
    });
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | ${this.eventStorage.welcomeInfo()}
    | ${this.auth.welcomeInfo()}
    |
    | Board available at: http://localhost:${this.serverPort}/
    |
    `);
  }

  start() {
    if (!this.noBanner) {
      this.displayBanner();
    }

    const app    = express();
    const server = app.listen(this.serverPort);
    const io     = SocketIo(server);
    const upload = multer({ dest: this.uploadsDir });

    this.server = server;

    app.use(express.static(path.resolve(`${__dirname}/frontend/`)));
    app.use(bodyParser.json());


    // ----------------- http -----------------
    app.get('/attachments/:fileName', (req, res) => {
      this.sendFileUsecase.sendResponse({
        fileName: req.params.fileName,
        expressResponse: res,
      });
    });

    app.post('/attachments/', upload.single('attachment'), (req, res) => {
      this.storeFileUsecase.addFile(req.file).then((fileUrl) => {
        res.send({ attachmentUrl: fileUrl });
      });
    });

    app.post('/login/', (req, res) => {
      const { email, password } = req.body;
      this.auth.authWithCredentials(email, password).then((authData) => {
        res.send({ userId: authData.userId, token: authData.token });
      }).catch(() => {
        res.send(403, 'access denied');
      });
    });


    // ----------- websockets utils -----------
    const allClientsNotifier = {
      onNewEvent: (newEvent) => {
        this.sockets.forEach((socket) => {
          socket.emit('newEvent', newEvent);
        });
      },
    };
    this.eventStorage.addObserver(allClientsNotifier);


    // -------------- webSockets --------------
    io.on('connection', (socket) => {
      this.auth.authWithToken(socket.handshake.query.token)
        .then(() => {
          this.configureSocket(socket);
          socket.emit('accessGranted');
        })
        .catch(() => {
          socket.emit('accessDenied');
          socket.disconnect();
        });
    });
  }

  stop() {
    this.server.close();
    this.server = null;
  }

  // private

  configureSocket(socket) {
    this.sockets.push(socket);
    socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(socket), 1);
    });

    socket.on('addEvent', (event, sendBack) => {
      this.auth.allowEvent(event, socket.handshake.query.token)
        .then(() => this.incommingEventProcessors.processEvent(event))
        .then(() => {
          sendBack(event);
          this.eventStorage.addEvent(event);
        })
        .catch(() => { sendBack(permissionDeniedEvent(event)); });
    });

    socket.on('getAllPastEvents', (sendBack) => {
      this.eventStorage.allPastEvents().then((events) => {
        sendBack(events);
      });
    });
  }
}
